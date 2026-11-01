// GET    /.netlify/functions/models?projectId=             the project's models with their translation state
// DELETE /.netlify/functions/models?projectId=&objectKey=  deletes one model and its translation
import { route, json } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import {
  aps, bucketKeyFor, deleteManifest, listObjects, manifestSummary, requireObjectKey, requireProjectId, urnFor
} from '../lib/aps.mjs'

export default route({
  async GET(req) {
    const user = await requireUser(req)
    const projectId = requireProjectId(new URL(req.url).searchParams.get('projectId'))
    const bucketKey = bucketKeyFor(user.uid, projectId)
    const objects = (await listObjects(bucketKey)) || []
    const models = await Promise.all(
      objects.map(async (object) => {
        const urn = urnFor(bucketKey, object.objectKey)
        return { objectKey: object.objectKey, size: object.size, urn, translation: await manifestSummary(urn) }
      })
    )
    models.sort((a, b) => a.objectKey.localeCompare(b.objectKey))
    return json(200, { models })
  },

  async DELETE(req) {
    const user = await requireUser(req)
    const params = new URL(req.url).searchParams
    const bucketKey = bucketKeyFor(user.uid, requireProjectId(params.get('projectId')))
    const objectKey = requireObjectKey(params.get('objectKey'))
    await deleteManifest(urnFor(bucketKey, objectKey))
    await aps(`/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(objectKey)}`, {
      method: 'DELETE',
      scopes: ['data:read', 'data:write'],
      ok: [404]
    })
    return json(200, { deleted: true })
  }
})
