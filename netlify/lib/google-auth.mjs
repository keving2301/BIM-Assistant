// An OAuth access token for a Google service account, without a library: sign a JWT with the account's private key
// and trade it at Google's token endpoint (https://developers.google.com/identity/protocols/oauth2/service-account).
import crypto from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

const encode = (value) => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url')

// privateKey is the PEM text. A value stored with literal "\n" sequences is accepted too.
export async function accessToken(clientEmail, privateKey, scope = 'https://www.googleapis.com/auth/cloud-platform') {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: clientEmail,
    scope,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), privateKey.replace(/\\n/g, '\n')).toString('base64url')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`Could not get an access token (${res.status})`)
  return (await res.json()).access_token
}
