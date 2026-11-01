// Autodesk Platform Services (APS) helpers: two-legged OAuth v2 tokens, OSS buckets and objects, and Model
// Derivative jobs. Credentials come from APS_CLIENT_ID and APS_CLIENT_SECRET (Netlify environment, functions scope).
import crypto from 'node:crypto'
import { HttpError } from './http.mjs'

const BASE = 'https://developer.api.autodesk.com'

// Limits that keep one account from using up the app's free APS quota.
export const LIMITS = {
  projectsPerUser: 5,
  modelsPerProject: 3,
  maxFileBytes: 150 * 1024 * 1024
}

// File types the Model Derivative service translates for the viewer (a subset of its list, single files only).
export const MODEL_EXTENSIONS = [
  'rvt', 'rfa', 'ifc', 'nwd', 'nwc', 'dwg', 'dxf', 'skp', 'fbx', 'obj', '3dm', 'stp', 'step', 'iges', 'igs'
]

const tokens = new Map()

function credentials() {
  const id = process.env.APS_CLIENT_ID
  const secret = process.env.APS_CLIENT_SECRET
  if (!id || !secret) throw new HttpError(500, 'The server is missing its Autodesk credentials.')
  return { id, secret }
}

// A client-credentials token for the given scopes, reused until a minute before it expires.
export async function apsToken(scopes) {
  const scope = [...scopes].sort().join(' ')
  const cached = tokens.get(scope)
  if (cached && cached.expiresAt - 60_000 > Date.now()) return cached
  const { id, secret } = credentials()
  const res = await fetch(`${BASE}/authentication/v2/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`
    },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope })
  })
  if (!res.ok) {
    console.error('APS token request failed', res.status, await res.text())
    throw new HttpError(502, 'Autodesk did not accept the app credentials.')
  }
  const body = await res.json()
  const token = { accessToken: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 }
  tokens.set(scope, token)
  return token
}

// Calls an APS endpoint. Returns the Response for the caller to read; `ok` lists statuses that are not errors.
export async function aps(path, { method = 'GET', scopes, body, headers = {}, ok = [] } = {}) {
  const { accessToken } = await apsToken(scopes)
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  })
  if (!res.ok && !ok.includes(res.status)) {
    const text = await res.text()
    console.error(`APS ${method} ${path} failed`, res.status, text.slice(0, 500))
    throw new HttpError(502, `Autodesk returned an error (${res.status}).`)
  }
  return res
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

// OSS bucket keys are global across every APS app and must match ^[-_.a-z0-9]{3,128}$. The key is derived from the
// verified uid and the project id on the server, so a caller can only ever address their own buckets. The first
// hash groups one user's buckets under a common prefix; the app's client id salts both so keys are not guessable.
export function userBucketPrefix(uid) {
  return `bimva-${sha256(`${credentials().id}:${uid}`).slice(0, 12)}-`
}

export function bucketKeyFor(uid, projectId) {
  return userBucketPrefix(uid) + sha256(`${credentials().id}:${uid}/${projectId}`).slice(0, 32)
}

export function requireProjectId(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(value)) {
    throw new HttpError(400, 'A valid project id is required.')
  }
  return value
}

export function requireObjectKey(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9._-]{1,128}$/.test(value) || value.startsWith('.')) {
    throw new HttpError(400, 'A valid model name is required.')
  }
  return value
}

// "Level 2 plan (final).rvt" -> "Level-2-plan-final.rvt"
export function objectKeyFromFileName(fileName) {
  const name = String(fileName || '').split(/[\\/]/).pop()
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
  if (!MODEL_EXTENSIONS.includes(ext)) {
    throw new HttpError(400, `This file type cannot be viewed. Upload one of: ${MODEL_EXTENSIONS.join(', ')}.`)
  }
  const base = name
    .slice(0, dot)
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 100)
  return `${base || 'model'}.${ext}`
}

// The Model Derivative URN of an OSS object: its object id in URL-safe base64 without padding.
export function urnFor(bucketKey, objectKey) {
  return Buffer.from(`urn:adsk.objects:os.object:${bucketKey}/${objectKey}`).toString('base64url')
}

// The project's bucket, created on first use. A user can hold at most LIMITS.projectsPerUser buckets.
export async function ensureProjectBucket(uid, projectId) {
  const bucketKey = bucketKeyFor(uid, projectId)
  const details = await aps(`/oss/v2/buckets/${bucketKey}/details`, { scopes: ['bucket:read'], ok: [404] })
  if (details.status !== 404) return { bucketKey, created: false }
  if ((await countUserBuckets(uid)) >= LIMITS.projectsPerUser) {
    throw new HttpError(403, `Each account can have up to ${LIMITS.projectsPerUser} projects. Delete one to add another.`)
  }
  const res = await aps('/oss/v2/buckets', {
    method: 'POST',
    scopes: ['bucket:create', 'bucket:read'],
    headers: { 'x-ads-region': 'US' },
    body: { bucketKey, policyKey: 'persistent' },
    ok: [409]
  })
  if (res.status === 409) {
    // Created a moment ago by a parallel request: make sure it is ours (another app's key would fail here).
    await aps(`/oss/v2/buckets/${bucketKey}/details`, { scopes: ['bucket:read'] })
    return { bucketKey, created: false }
  }
  return { bucketKey, created: true }
}

export async function listObjects(bucketKey) {
  // 404: never created. 403: deleted (OSS keeps a deleted key unavailable for a while).
  const res = await aps(`/oss/v2/buckets/${bucketKey}/objects?limit=100`, { scopes: ['data:read'], ok: [403, 404] })
  if (res.status === 403 || res.status === 404) return null
  const body = await res.json()
  return body.items || []
}

// How many buckets (projects) one user already has, from the app's bucket list.
export async function countUserBuckets(uid) {
  const prefix = userBucketPrefix(uid)
  let count = 0
  let path = '/oss/v2/buckets?limit=100'
  for (let page = 0; path && page < 20; page++) {
    const body = await (await aps(path, { scopes: ['bucket:read'] })).json()
    count += (body.items || []).filter((item) => item.bucketKey.startsWith(prefix)).length
    path = body.next ? body.next.replace(BASE, '') : null
  }
  return count
}

// Starts an SVF2 translation for the viewer (2D sheets and 3D views). IFC files use the v4 loader and keep spaces
// (rooms) and storeys in the model, hidden, so the assistant can read their names, levels and areas. Revit files
// get master views, which carry the rooms.
export async function startTranslation(urn, objectKey) {
  const ext = objectKey.split('.').pop().toLowerCase()
  const format = { type: 'svf2', views: ['2d', '3d'] }
  if (ext === 'ifc') {
    format.advanced = { conversionMethod: 'v4', spaces: 'hide', buildingStoreys: 'hide', openingElements: 'skip' }
  } else if (ext === 'rvt') {
    format.advanced = { generateMasterViews: true }
  }
  const res = await aps('/modelderivative/v2/designdata/job', {
    method: 'POST',
    scopes: ['data:read', 'data:write', 'data:create'],
    headers: { 'x-ads-force': 'true' },
    body: { input: { urn }, output: { destination: { region: 'us' }, formats: [format] } }
  })
  return res.json()
}

// The translation state of one model: none (never translated), pending, inprogress, success, failed or timeout.
export async function manifestSummary(urn) {
  const res = await aps(`/modelderivative/v2/designdata/${urn}/manifest`, { scopes: ['data:read'], ok: [404] })
  if (res.status === 404) return { status: 'none', progress: null, messages: [] }
  const manifest = await res.json()
  const messages = []
  const collect = (node) => {
    for (const message of node.messages || []) {
      if (message.type === 'error' || message.type === 'warning') {
        messages.push({ type: message.type, code: message.code, message: [].concat(message.message || '').join(' ') })
      }
    }
    for (const child of node.derivatives || node.children || []) collect(child)
  }
  collect(manifest)
  return {
    status: manifest.status,
    progress: manifest.progress,
    hasThumbnail: manifest.hasThumbnail === 'true' || manifest.hasThumbnail === true,
    messages: messages.slice(0, 5)
  }
}

export async function deleteManifest(urn) {
  await aps(`/modelderivative/v2/designdata/${urn}/manifest`, {
    method: 'DELETE',
    scopes: ['data:read', 'data:write'],
    ok: [404]
  })
}
