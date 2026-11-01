# BIM Virtual Assistant

A web app for looking at building information models (BIM) in the browser. Sign up, create a project, upload a model
(Revit, IFC, Navisworks, DWG and other formats), explore it in the Autodesk viewer, and ask the chat assistant how
many walls, doors and windows it has, which levels it spans and how large each room is.

Live: https://bim-virtual-assistant.netlify.app

## How it is built

- **Front end:** Nuxt 2 (static generation) and Vue 2 with bootstrap-vue (Bootstrap 4), IBM Plex Sans.
- **Accounts and projects:** Firebase Authentication (email and password) and Cloud Firestore, project
  `bim-virtual-assistant-kg`. `userdata/{uid}` holds the profile and `userdata/{uid}/buckets/{projectId}` the projects;
  `firestore.rules` lets each user read and write only their own documents.
- **Server:** Netlify Functions in `netlify/functions` (Node 22, plain `fetch`). Each one verifies the caller's Firebase
  ID token against Google's public keys, then calls Autodesk Platform Services (APS) with two-legged OAuth v2:
  - `viewer-token`: a token limited to `viewables:read` for the viewer
  - `projects`: create or delete the project's OSS bucket (the key is derived from the uid and the project id)
  - `models`: list a project's models with their translation state, or delete one
  - `upload`: signed S3 upload URLs, then completion and the SVF2 translation job
  - `translate`: translation state (polled by the app) or a new translation
  - `thumbnail`: the model preview shown on project cards
- **Viewer:** Autodesk Viewer 7 (SVF2). The model summary and the chat answers are read from the model's properties.
- **Assistant:** Dialogflow Messenger. The agent recognizes the question (HowManyWalls, SizeOfRoom and so on) and the
  app answers it from the open model (`utils/assistant.js`, `utils/model-index.js`).

## The demo account

The sign-in page shows the credentials of a demo account and a button that signs in with them. It holds invented data:
a project with an apartment block model that is already translated, and an empty one. Anyone can use it, so the server
refuses what would use up the Autodesk free tier or change what the next visitor finds. For the demo account (its uid
is in `netlify/lib/demo.mjs` and `firestore.rules`):

- `projects` (create, delete), `upload`, `translate` (POST) and `models` (DELETE) answer 403 with a clear message.
- `firestore.rules` allows reads under its `userdata/{uid}` but no writes.
- The app disables those controls and says so once on each page (`components/DemoNote.vue`).

Firebase Auth lets a signed-in user change their own email and password through Google's public API, which nothing in
the app can block. `netlify/functions/demo-reset.mjs` is a scheduled function (hourly, UTC) that sets the demo account's
email, password and name back. It signs in as the service account `demo-reset@bim-virtual-assistant-kg.iam.gserviceaccount.com`
(role: Firebase Authentication Admin) whose private key is the secret Netlify environment variable `DEMO_RESET_KEY`
(scope: functions) beside `DEMO_RESET_EMAIL`; neither is in the repository. To rotate the key: create a new one for that
service account, replace the variable, delete the old key.

Viewing, the model summary and the chat keep working. Sign-up is open, so anyone can try uploads with their own account
(the per-account limits in `netlify/lib/aps.mjs` still apply).

## Run it locally

```
npm install
npm run dev            # Nuxt dev server (the functions are not served)
```

To try the full app with its functions, put `APS_CLIENT_ID` and `APS_CLIENT_SECRET` in `.env` (never commit it), then:

```
npm run generate
netlify dev --offline --dir dist --framework "#static"
```

## Deploy

Netlify builds `master` with `npm run generate` and publishes `dist` (see `netlify.toml`). `APS_CLIENT_ID` and
`APS_CLIENT_SECRET` are secret environment variables scoped to functions in the Netlify site settings. Firestore rules
deploy with `firebase deploy --only firestore:rules --project bim-virtual-assistant-kg`.
