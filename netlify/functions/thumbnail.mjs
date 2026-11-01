// GET /.netlify/functions/thumbnail?projectId=&objectKey=  the model's preview image (PNG, 400 px) from its translation
import { route, json } from '../lib/http.mjs'
import { requireUser } from '../lib/firebase-auth.mjs'
import { aps, bucketKeyFor, requireObjectKey, requireProjectId, urnFor } from '../lib/aps.mjs'

export default route({
  async GET(req) {
    const user = await requireUser(req)
    const params = new URL(req.url).searchParams
    const bucketKey = bucketKeyFor(user.uid, requireProjectId(params.get('projectId')))
    const urn = urnFor(bucketKey, requireObjectKey(params.get('objectKey')))
    const res = await aps(`/modelderivative/v2/designdata/${urn}/thumbnail?width=400&height=400`, {
      scopes: ['data:read'],
      ok: [404]
    })
    if (res.status === 404) return json(404, { error: 'This model has no preview yet.' })
    return new Response(await res.arrayBuffer(), {
      status: 200,
      headers: { 'content-type': res.headers.get('content-type') || 'image/png', 'cache-control': 'private, max-age=3600' }
    })
  }
})
