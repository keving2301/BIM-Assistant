const ForgeSDK = require('forge-apis')
const config = require('../config/config')
const ObjectsAPI = new ForgeSDK.ObjectsApi()

const oAuth2Legged = new ForgeSDK.AuthClientTwoLegged(config.consumerKey, config.consumerSecret, [
    'data:read',
    'data:write',
    'bucket:read'
], true)

export default {
    path: '/api/objects',
    handler(req, res) {
        let bucketURN = req.url.replace('/', '')
        oAuth2Legged.authenticate().then(credentials => {
            ObjectsAPI.getObjects(bucketURN, {}, oAuth2Legged, credentials).then(objects => {
                res.end(JSON.stringify(objects))
            })
        })
    }
}
