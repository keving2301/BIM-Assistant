// GET  /.netlify/functions/translate?projectId=&objectKey=  the model's translation state (polled while it runs)
// POST /.netlify/functions/translate { projectId, objectKey }  translates the model again
import { route, json, readJson, HttpError } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import {
  aps, bucketKeyFor, manifestSummary, requireObjectKey, requireProjectId, startTranslation, urnFor
} from '../lib/aps.mjs'

export default route({
  async GET(req) {
    const user = await requireUser(req)
    const params = new URL(req.url).searchParams
    const bucketKey = bucketKeyFor(user.uid, requireProjectId(params.get('projectId')))
    const urn = urnFor(bucketKey, requireObjectKey(params.get('objectKey')))
    return json(200, { urn, translation: await manifestSummary(urn) })
  },

  async POST(req) {
    const user = await requireUser(req)
    const body = await readJson(req)
    const bucketKey = bucketKeyFor(user.uid, requireProjectId(body.projectId))
    const objectKey = requireObjectKey(body.objectKey)
    // Only a model in this user's own project can be translated.
    const details = await aps(`/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}/details`, {
      scopes: ['data:read'],
      ok: [403, 404]
    })
    if (!details.ok) throw new HttpError(404, 'This model is not in the project.')
    const urn = urnFor(bucketKey, objectKey)
    await startTranslation(urn, objectKey)
    return json(202, { urn })
  }
})
