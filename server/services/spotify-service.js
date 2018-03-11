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
    spotifyApi = new SpotifyWebApi();
    const {accessToken, refreshToken} = TokenService.getToken()
    spotifyApi.setCredentials({accessToken, refreshToken, redirectUri, clientId, clientSecret})
  }

  setAuthorizationCode (code) {
    spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    return spotifyApi.authorizationCodeGrant(code).then(data => {
      console.log(data.body)
      const token = TokenService.normalize(data.body)
      // const token = TokenService.setToken(data.body)
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)


      return spotifyApi.getMe().then(data => { 
        console.log("getMe() returned", data)
        return spotifyApi
          .getUserPlaylists(data.body.id)
          .then(data => data.body)
      })

    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  refreshToken () {
    spotifyApi.refreshAccessToken().then(data => {
      const token = TokenService.normalize(data.body)
      // const token = TokenService.setToken(data.body)
      spotifyApi.setAccessToken(token.accessToken);
    }, function(err) {
      console.log('Could not refresh access token', err);
    });
  }

  getPlaylists() {
    return spotifyApi.getMe().then(data => {
      console.log("getMe() returned", data)
      return spotifyApi.getUserPlaylists(data.body.id).then(data => data.body)
    })
  }


}
