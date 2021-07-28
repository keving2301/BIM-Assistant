const ForgeSDK = require('forge-apis')
const config = require('../config/config')
const BucketsAPI = new ForgeSDK.BucketsApi()

let bucket
let bucketArray = []

const oAuth2Legged = new ForgeSDK.AuthClientTwoLegged(config.consumerKey, config.consumerSecret, [
    'data:read',
    'data:write',
    'bucket:read'
], true)

oAuth2Legged.authenticate().then(function (credentials) {
    BucketsAPI.getBuckets({}, oAuth2Legged, credentials).then(function (buckets) {
        bucket = buckets
        for (let i = 0; i < bucket.body.items.length; ++i) {
            bucketArray.push(bucket.body.items[i])
        }
    })
})

export default {
    path: '/api/buckets',
    handler(req, res) {
        res.end(JSON.stringify(bucket))
    }
}
