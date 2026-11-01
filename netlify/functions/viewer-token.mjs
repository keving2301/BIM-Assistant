// GET /.netlify/functions/viewer-token
// A token for the Autodesk viewer, scoped to viewables:read only (it can display translated models but cannot list,
// read, change or delete files). Only signed-in users get one.
import { route, json } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import { apsToken } from '../lib/aps.mjs'

export default route({
  async GET(req) {
    await requireUser(req)
    const token = await apsToken(['viewables:read'])
    return json(200, {
      access_token: token.accessToken,
      expires_in: Math.max(0, Math.floor((token.expiresAt - Date.now()) / 1000))
    })
  }
})
