import ForgeSDK from 'forge-apis'
import config from '../config/config'
const BucketsAPI = new ForgeSDK.BucketsApi()

const oAuth2Legged = new ForgeSDK.AuthClientTwoLegged(config.consumerKey, config.consumerSecret, [
    'data:read',
    'data:write',
    'bucket:read'
], true)

export default {
    path: '/api/bucketDetails',
    handler(req, res) {
        let bucketURN = req.url.replace('/', '')
        oAuth2Legged.authenticate().then(credentials => {
            BucketsAPI.getBucketDetails(bucketURN, oAuth2Legged, credentials).then(details => {
                res.end(JSON.stringify(details))
            })
        })
    }
}
