const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const app = require('../server')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state']
const limit = 50

module.exports = class SpotifyService {
  getSpotifyApiForUser (userId) {
    // Extra promise in here because loopback's ORM isn't fully promise compliant and doesn't work well with async/await
    return new Promise((resolve, reject) => {
      app.models.AppUser.findById(userId).then(appUser => {
        const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
        // if (!appUser.spotifyUser || !appUser.spotifyUser.token) {
        //   resolve(spoti)
        //   reject(new Error(`No access token fro for user with id: ${userId}`))
        // }
        const accessToken = appUser.spotifyUser && appUser.spotifyUser.token && appUser.spotifyUser.token.accessToken
        spotifyApi.setAccessToken(accessToken)
        resolve(spotifyApi)
      })
    })
  }

  getAuthorizationUrl () {
    return new SpotifyWebApi({clientId, redirectUri}).createAuthorizeURL(scopes, 'some-state-of-my-choice')
  }

  async setAuthorizationCode (userId, code) {
    try {
      const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
      const tokenResponse = await spotifyApi.authorizationCodeGrant(code)
      const token = TokenService.normalize(tokenResponse.body)

      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)
      const spotifyUser = await spotifyApi.getMe().then(data => data.body)
      spotifyUser.token = token

      return new Promise(resolve => {
        app.models.AppUser.findById(userId).then(appUser => {
          appUser.spotifyUser = spotifyUser
          appUser.save().then(() => resolve())
        })
      })
    } catch (error) {
      console.log('Something went wrong!', error)
    }
  }

  async getAccessToken (userId) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    return spotifyApi.getAccessToken()
  }

  async getMe (userId) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    return spotifyApi.getMe().then(data => data.body)
  }

  async refreshToken (userId) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    spotifyApi.refreshAccessToken().then(data => {
      const token = TokenService.normalize(data.body)
      spotifyApi.setAccessToken(token.accessToken)
    }).catch(err => {
      console.log('Could not refresh access token', err)
    })
  }

  async play (userId, spotifyURI) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    return spotifyApi.play({uris: [ spotifyURI ]})
      .then(data => data.body)
  }

  async transferPlayback (userId, deviceID, play) {
    let argsObject = {device_ids: [ deviceID ]}
    argsObject.play = typeof play === 'boolean' ? play : false

    console.log('Transferring playback with options object', argsObject)

    const spotifyApi = await this.getSpotifyApiForUser(userId)
    return spotifyApi.transferMyPlayback(argsObject).then(data => data.body)
  }

  async getPlaylist (userId, playlistID) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    // TODO: We should get the user from the database back rather than calling getMe()
    return spotifyApi.getMe().then(data => {
      return spotifyApi.getPlaylist(data.body.id, playlistID).then(data => data.body)
    })
  }

  async getDevices (userId) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    return spotifyApi.getMyDevices().then(data => data.body)
  }

  async getPlaylists (userId) {
    const spotifyApi = await this.getSpotifyApiForUser(userId)
    const user = await spotifyApi.getMe().then(data => data.body)
    const sampling = await spotifyApi.getUserPlaylists(user.id, {limit: 1}).then(data => data.body)
    const pageCount = Math.ceil(sampling.total / limit)
    const pages = Array.from(Array(pageCount).keys())
    const promises = pages.map(p => spotifyApi.getUserPlaylists(user.id, {limit, offset: p * limit}).then(data => data.body.items))
    return Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val)))
  }
}
