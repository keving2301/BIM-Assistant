// POST   /.netlify/functions/projects            { projectId }  creates the project's storage bucket
// DELETE /.netlify/functions/projects?projectId=  deletes the bucket, its models and their translations
// The bucket key is derived from the verified uid and the project id, so a user only reaches their own buckets.
import { route, json, readJson } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import { aps, bucketKeyFor, deleteManifest, ensureProjectBucket, listObjects, requireProjectId, urnFor } from '../lib/aps.mjs'

export default route({
  async POST(req) {
    const user = await requireUser(req)
    const { projectId } = await readJson(req)
    const { bucketKey, created } = await ensureProjectBucket(user.uid, requireProjectId(projectId))
    return json(created ? 201 : 200, { bucketKey })
  },

  async DELETE(req) {
    const user = await requireUser(req)
    const projectId = requireProjectId(new URL(req.url).searchParams.get('projectId'))
    const bucketKey = bucketKeyFor(user.uid, projectId)
    const objects = await listObjects(bucketKey)
    if (objects) {
      await Promise.all(objects.map((object) => deleteManifest(urnFor(bucketKey, object.objectKey))))
      await aps(`/oss/v2/buckets/${bucketKey}`, { method: 'DELETE', scopes: ['bucket:delete'], ok: [404] })
    }
    return json(200, { deleted: true })
  }
})
