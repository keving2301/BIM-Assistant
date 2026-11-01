// The public demo account (see README): anyone can sign in as it from the sign-in page, so the server refuses what
// would use up the Autodesk free tier or change what the next visitor finds. The same account is also blocked from
// writing in firestore.rules. Viewing, the model summary and the chat do not touch these routes.
import { HttpError } from './http.mjs'

export const DEMO_UID = 'mp6eXC0l8vfLBfAHwoAH050YRcR2'

const REASONS = {
  createProject: 'Creating projects is not available in the demo account. Create your own account to try it.',
  deleteProject: 'Deleting projects is not available in the demo account. Create your own account to try it.',
  upload: 'Uploading models is not available in the demo account. Create your own account to try it.',
  translate: 'Translating models is not available in the demo account. Create your own account to try it.',
  deleteModel: 'Deleting models is not available in the demo account. Create your own account to try it.'
}

// Throws a 403 with a message the app shows as it is.
export function refuseDemo(user, action) {
  if (user.uid === DEMO_UID) throw new HttpError(403, REASONS[action])
}
