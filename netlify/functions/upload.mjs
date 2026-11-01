// POST /.netlify/functions/upload
//   { action: 'start', projectId, fileName, size }
//     -> { objectKey, uploadKey, urls, partSize }: signed S3 URLs the browser PUTs the file parts to directly
//   { action: 'complete', projectId, objectKey, uploadKey, size }
//     -> { objectKey, urn }: OSS assembles the parts, then the SVF2 translation starts
// The file bytes never pass through the function (its request body is limited to 6 MB).
import { route, json, readJson, HttpError } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import {
  aps, bucketKeyFor, ensureProjectBucket, LIMITS, listObjects, objectKeyFromFileName, requireObjectKey,
  requireProjectId, startTranslation, urnFor
} from '../lib/aps.mjs'

// S3 multipart parts must be at least 5 MB, except the last one.
const PART_SIZE = 16 * 1024 * 1024

async function start(user, body) {
  const projectId = requireProjectId(body.projectId)
  const size = Number(body.size)
  if (!Number.isFinite(size) || size <= 0) throw new HttpError(400, 'The file is empty.')
  if (size > LIMITS.maxFileBytes) {
    throw new HttpError(413, `Models can be up to ${Math.round(LIMITS.maxFileBytes / 1024 / 1024)} MB.`)
  }
  const objectKey = objectKeyFromFileName(body.fileName)
  const { bucketKey } = await ensureProjectBucket(user.uid, projectId)
  const objects = (await listObjects(bucketKey)) || []
  if (objects.length >= LIMITS.modelsPerProject && !objects.some((o) => o.objectKey === objectKey)) {
    throw new HttpError(403, `A project can hold up to ${LIMITS.modelsPerProject} models. Delete one to upload another.`)
  }
  const parts = Math.max(1, Math.ceil(size / PART_SIZE))
  const res = await aps(
    `/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/signeds3upload?parts=${parts}&minutesExpiration=30`,
    { scopes: ['data:read', 'data:write', 'data:create'] }
  )
  const signed = await res.json()
  return json(200, { objectKey, uploadKey: signed.uploadKey, urls: signed.urls, partSize: PART_SIZE })
}

async function complete(user, body) {
  const bucketKey = bucketKeyFor(user.uid, requireProjectId(body.projectId))
  const objectKey = requireObjectKey(body.objectKey)
  if (typeof body.uploadKey !== 'string' || !body.uploadKey) throw new HttpError(400, 'The upload key is missing.')
  const res = await aps(`/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/signeds3upload`, {
    method: 'POST',
    scopes: ['data:read', 'data:write', 'data:create'],
    body: { uploadKey: body.uploadKey, ...(Number(body.size) > 0 ? { size: Number(body.size) } : {}) }
  })
  const result = await res.json()
  if (result.status === 'error') {
    console.error('Upload completion failed', JSON.stringify(result).slice(0, 500))
    throw new HttpError(400, 'The upload did not finish. Try uploading the file again.')
  }
  const urn = urnFor(bucketKey, objectKey)
  await startTranslation(urn, objectKey)
  return json(200, { objectKey, urn, size: result.size })
}

export default route({
  async POST(req) {
    const user = await requireUser(req)
    const body = await readJson(req)
    if (body.action === 'start') return start(user, body)
    if (body.action === 'complete') return complete(user, body)
    throw new HttpError(400, 'Unknown upload action.')
  }
})
