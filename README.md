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
