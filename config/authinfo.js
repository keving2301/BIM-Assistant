module.exports = class AuthInfo {
    _client_id
    _client_secret
    _grant_type
    _baseUrl
    _version

    constructor (client_id, client_secret) {
        this._client_id = client_id
        this._client_secret = client_secret
        this._grant_type = 'client_credentials'
        this._baseUrl = 'https://developer.api.autodesk.com'
        this._version = 'v1'
    }

    get Authentication () {
        return this._baseUrl + '/authentication/' + this._version + '/authenticate'
    }

    get Credentials () {
        return {
            client_id: this._client_id,
            client_secret: this._client_secret,
            grant_type: this._grant_type,
            scope: ['data:read', 'viewables:read']
        }
    }
}
