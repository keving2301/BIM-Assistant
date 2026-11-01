// The public demo account. Anyone may sign in with it (the sign-in page shows the credentials and a button), so the
// functions and firestore.rules refuse what would change or use up its data (see netlify/lib/demo.mjs), and the hourly
// netlify/functions/demo-reset.mjs puts its email, password and name back. The reset imports this file too.
// These values are shown to every visitor by design; the account holds only invented data.
export const DEMO_EMAIL = 'demo.bim@example.com'
export const DEMO_PASSWORD = 'Bim-eZC3CZ8G37-7'
export const DEMO_UID = 'mp6eXC0l8vfLBfAHwoAH050YRcR2'
export const DEMO_NAME = 'Dana Whitfield'
export const DEMO_NOTICE = 'Not available in the demo account'
