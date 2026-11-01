// Verifies a Firebase ID token without the Admin SDK: the token is a JWT signed with RS256 by one of Google's
// rotating keys, so we check the signature against Google's published X.509 certificates and then the claims
// Firebase documents (audience, issuer, subject, expiry). See
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
import crypto from 'node:crypto'
import { HttpError } from './http.mjs'

export const FIREBASE_PROJECT_ID = 'bim-virtual-assistant-kg'
const CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
const CLOCK_SKEW_SECONDS = 300

let certs = { keys: null, expiresAt: 0 }

async function googleCerts(force = false) {
  if (!force && certs.keys && Date.now() < certs.expiresAt) return certs.keys
  const res = await fetch(CERTS_URL)
  if (!res.ok) throw new Error(`Could not load Google's public keys (${res.status})`)
  const maxAge = Number((res.headers.get('cache-control') || '').match(/max-age=(\d+)/)?.[1] || 3600)
  certs = { keys: await res.json(), expiresAt: Date.now() + maxAge * 1000 }
  return certs.keys
}

function decodeSegment(segment) {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'))
}

export async function verifyIdToken(token) {
  const segments = String(token).split('.')
  if (segments.length !== 3) throw new Error('Malformed token')
  const [encodedHeader, encodedPayload, encodedSignature] = segments
  const header = decodeSegment(encodedHeader)
  const payload = decodeSegment(encodedPayload)
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Unexpected token algorithm')

  let keys = await googleCerts()
  if (!keys[header.kid]) keys = await googleCerts(true)
  const cert = keys[header.kid]
  if (!cert) throw new Error('Unknown signing key')

  const signed = Buffer.from(`${encodedHeader}.${encodedPayload}`)
  const signature = Buffer.from(encodedSignature, 'base64url')
  if (!crypto.verify('RSA-SHA256', signed, crypto.createPublicKey(cert), signature)) {
    throw new Error('Bad signature')
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.aud !== FIREBASE_PROJECT_ID) throw new Error('Wrong audience')
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) throw new Error('Wrong issuer')
  if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128) throw new Error('No subject')
  if (typeof payload.exp !== 'number' || payload.exp < now) throw new Error('Expired')
  if (typeof payload.iat !== 'number' || payload.iat > now + CLOCK_SKEW_SECONDS) throw new Error('Issued in the future')
  if (typeof payload.auth_time === 'number' && payload.auth_time > now + CLOCK_SKEW_SECONDS) {
    throw new Error('Signed in in the future')
  }
  return { uid: payload.sub, email: payload.email || null }
}

// The signed-in user behind a request, from its "Authorization: Bearer <Firebase ID token>" header.
export async function requireUser(req) {
  const match = (req.headers.get('authorization') || '').match(/^Bearer\s+(\S+)$/i)
  if (!match) throw new HttpError(401, 'Sign in to continue.')
  try {
    return await verifyIdToken(match[1])
  } catch (err) {
    console.warn('Rejected ID token:', err.message)
    throw new HttpError(401, 'Your session has expired. Sign in again.')
  }
}
