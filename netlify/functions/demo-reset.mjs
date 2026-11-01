// Runs every hour (the schedule below, UTC) and puts the demo account's sign-in back as the sign-in page shows it:
// its email, its password and its display name. Firebase Auth lets a signed-in user change their own email and password
// through Google's public API, which no security rule or function of this app can block, so this bounds the damage if
// a visitor does. The service account key is a secret environment variable scoped to functions (DEMO_RESET_EMAIL and
// DEMO_RESET_KEY); it is not in the repository. The account's data needs no reset: firestore.rules and the functions
// already refuse every write for it.
import { accessToken } from '../lib/google-auth.mjs'
import { DEMO_EMAIL, DEMO_NAME, DEMO_PASSWORD, DEMO_UID } from '../../utils/demo.js'

const PROJECT = 'bim-virtual-assistant-kg'

export default async () => {
  const clientEmail = process.env.DEMO_RESET_EMAIL
  const privateKey = process.env.DEMO_RESET_KEY
  if (!clientEmail || !privateKey) {
    console.error('demo-reset: DEMO_RESET_EMAIL or DEMO_RESET_KEY is not set')
    return Response.json({ ok: false }, { status: 500 })
  }
  try {
    const token = await accessToken(clientEmail, privateKey)
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:update`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        localId: DEMO_UID,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        displayName: DEMO_NAME,
        emailVerified: true,
        disableUser: false
      })
    })
    if (!res.ok) throw new Error(`Updating the demo account failed (${res.status})`)
    console.log('demo-reset: demo account restored')
    return Response.json({ ok: true })
  } catch (error) {
    console.error('demo-reset failed:', error.message)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export const config = { schedule: '@hourly' }
