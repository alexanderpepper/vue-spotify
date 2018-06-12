const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state']
const limit = 50
const resolver = (promise) => promise.then(data => data.body).catch(console.log)

module.exports = class SpotifyService {
  static getSpotifyApi (user) {
    const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    const token = user && user.spotifyUser && user.spotifyUser.token
    if (token) {
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)
    }
    return spotifyApi
  }

  static getAuthorizationUrl () {
    return new SpotifyWebApi({clientId, redirectUri}).createAuthorizeURL(scopes, 'new-spotify-utils-user')
  }

  static async setAuthorizationCode (user, code) {
    const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    const tokenResponse = await spotifyApi.authorizationCodeGrant(code)
    const token = TokenService.create(tokenResponse.body)
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const spotifyUser = await spotifyApi.getMe().then(data => data.body)
    user.spotifyUser = {...spotifyUser, token}

    return new Promise(resolve => user.save().then(resolve))
  }

  static async refreshToken (user) {
    const data = await resolver(this.getSpotifyApi(user).refreshAccessToken())

    if (!data) return user

    const token = TokenService.create(data)
    user.spotifyUser.token.accessToken = token.accessToken
    user.spotifyUser.token.expirationDate = token.expirationDate
    if (token.refreshToken) {
      user.spotifyUser.token.refreshToken = token.refreshToken
    }

    return new Promise(resolve => {
      user.save().then(savedUser => resolve(savedUser))
    })
  }

  static play (user, songs) {
    return resolver(this.getSpotifyApi(user).play(songs))
  }

  static pause (user) {
    return resolver(this.getSpotifyApi(user).pause())
  }

  static skipToNext (user) {
    return resolver(this.getSpotifyApi(user).skipToNext())
  }

  static skipToPrevious (user) {
    return resolver(this.getSpotifyApi(user).skipToPrevious())
  }

  static getPlaybackState (user) {
    return resolver(this.getSpotifyApi(user).getMyCurrentPlaybackState())
  }

  static seek (user, position) {
    return resolver(this.getSpotifyApi(user).seek(position))
  }

  static setVolume (user, volume) {
    return resolver(this.getSpotifyApi(user).setVolume(volume))
  }

  static setShuffle (user, shuffle) {
    return resolver(this.getSpotifyApi(user).setShuffle({state: shuffle}))
  }

  static setRepeat (user, repeat) {
    return resolver(this.getSpotifyApi(user).setRepeat({state: repeat}))
  }

  static transferPlayback (user, deviceID, play) {
    const argsObject = {
      device_ids: [deviceID],
      play: typeof play === 'boolean' ? play : false
    }
    return resolver(this.getSpotifyApi(user).transferMyPlayback(argsObject))
  }

  static getPlaylist (user, playlistID) {
    return resolver(this.getSpotifyApi(user).getPlaylist(user.spotifyUser.id, playlistID))
  }

  static getDevices (user) {
    return resolver(this.getSpotifyApi(user).getMyDevices())
  }

  static async getPlaylists (user) {
    const spotifyApi = this.getSpotifyApi(user)
    const sampling = await spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit: 1}).then(data => data.body)
    const pageCount = Math.ceil(sampling.total / limit)
    const pages = Array.from(Array(pageCount).keys())
    const promises = pages.map(p => spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit, offset: p * limit}).then(data => data.body.items))
    return Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val))).catch(console.log)
  }
}
