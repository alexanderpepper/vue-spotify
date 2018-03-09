const TokenService = require('./TokenService')
const SpotifyWebApi = require('spotify-web-api-node')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['playlist-read-private']

module.exports = class SpotifyService {

  getAuthorizationUrl () {
    const spotifyApi = new SpotifyWebApi({clientId, redirectUri})
    return spotifyApi.createAuthorizeURL(scopes, 'some-state-of-my-choice')
  }

  setCredentials () {
    this.spotifyApi = new SpotifyWebApi();
    const {accessToken, refreshToken} = TokenService.getToken()
    this.spotifyApi.setCredentials({accessToken, refreshToken, redirectUri, clientId, clientSecret})
  }

  setAuthorizationCode (code) {
    this.spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    return this.spotifyApi.authorizationCodeGrant(code).then(data => {
      console.log(data.body)
      const token = TokenService.setToken(data.body)
      this.spotifyApi.setAccessToken(token.accessToken)
      this.spotifyApi.setRefreshToken(token.refreshToken)
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  refreshToken () {
    this.spotifyApi.refreshAccessToken().then(data => {
      const token = TokenService.setToken(data.body)
      this.spotifyApi.setAccessToken(token.accessToken);
    }, function(err) {
      console.log('Could not refresh access token', err);
    });
  }

  getPlaylists() {
    return this.spotifyApi.getUserPlaylists('1232656450').then(data => data.body)
  }


}
