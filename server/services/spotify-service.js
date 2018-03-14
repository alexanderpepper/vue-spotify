const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['playlist-read-private']
let spotifyApi

module.exports = class SpotifyService {
  getAuthorizationUrl () {
    const spotifyApi = new SpotifyWebApi({clientId, redirectUri})
    return spotifyApi.createAuthorizeURL(scopes, 'some-state-of-my-choice')
  }

  setCredentials () {
    spotifyApi = new SpotifyWebApi()
    const {accessToken, refreshToken} = TokenService.getToken()
    spotifyApi.setCredentials({accessToken, refreshToken, redirectUri, clientId, clientSecret})
  }

  setAuthorizationCode (code) {
    spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    return spotifyApi.authorizationCodeGrant(code).then(data => {
      const token = TokenService.normalize(data.body)
      // TokenService.setToken(token)
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)
      return data.body
    }, function (err) {
      console.log('Something went wrong!', err)
    })
  }

  refreshToken () {
    spotifyApi.refreshAccessToken().then(data => {
      const token = TokenService.normalize(data.body)
      spotifyApi.setAccessToken(token.accessToken)
    }).catch(err => {
      console.log('Could not refresh access token', err)
    })
  }

  getPlaylists () {
    // this.setCredentials()
    return spotifyApi.getMe().then(data => {
      //console.log('getMe() returned', data.body)
      return Promise.all([0,1,2].map(n => spotifyApi.getPlaylists(data.body.id, {offset: n, limit: 1})).then(data => data.body))
    })
  }
}
