const ForgeSDK = require('forge-apis')
const config = require('../config/config')
const BucketsAPI = new ForgeSDK.BucketsApi()


const oAuth2Legged = new ForgeSDK.AuthClientTwoLegged(config.consumerKey, config.consumerSecret, [
    'data:read',
    'data:write',
    'bucket:read',
    'bucket:delete'
], true)

export default {
    path: '/api/deleteBucket',
    handler(req, res) {
        let bucketURN = req.url.replace('/', '')
        oAuth2Legged.authenticate().then(credentials => {
            BucketsAPI.deleteBucket(bucketURN, oAuth2Legged, credentials).then()
            res.end('deleted')
        })
    }
}
