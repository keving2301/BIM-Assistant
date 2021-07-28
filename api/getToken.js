const config = require('../config/config')
const AuthInfo = require('../config/authinfo')
const AuthClientTwoLegged = require('forge-apis/src/auth/OAuth2TwoLegged')

const authInfo = new AuthInfo(
    config.consumerKey,
    config.consumerSecret
).Credentials

export default {
    path: '/api/token',
    handler(req, res) {
        const clientId = authInfo.client_id
        const clientSecret = authInfo.client_secret

        const apiInstance = new AuthClientTwoLegged(clientId, clientSecret, authInfo.scope)
        apiInstance.authenticate().then((data) => res.end(JSON.stringify(data)))
    }
}