const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state']
const limit = 50

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
    const data = await this.getSpotifyApi(user)
      .refreshAccessToken()
      .then(data => data.body)
      .catch(console.log)

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

  static getMe (user) {
    return this.getSpotifyApi(user)
      .getMe()
      .then(data => data.body)
      .catch(console.log)
  }

  static play (user, uris) {
    return this.getSpotifyApi(user)
      .play(uris)
      .then(data => data.body)
      .catch(console.log)
  }

  static pause (user) {
    return this.getSpotifyApi(user)
      .pause()
      .then(data => data.body)
      .catch(console.log)
  }

  static skipToNext (user) {
    return this.getSpotifyApi(user)
      .skipToNext()
      .then(data => data.body)
      .catch(console.log)
  }

  static skipToPrevious (user) {
    return this.getSpotifyApi(user)
      .skipToPrevious()
      .then(data => data.body)
      .catch(console.log)
  }

  static getPlaybackState (user) {
    return this.getSpotifyApi(user)
      .getMyCurrentPlaybackState()
      .then(data => data.body)
      .catch(console.log)
  }

  static getPlayingTrack (user) {
    return this.getSpotifyApi(user)
      .getMyCurrentPlayingTrack()
      .then(data => data.body)
      .catch(console.log)
  }

  static seek (user, position) {
    return this.getSpotifyApi(user)
      .seek(position)
      .then(data => data.body)
      .catch(console.log)
  }

  static setVolume (user, volume) {
    return this.getSpotifyApi(user)
      .setVolume(volume)
      .then(data => data.body)
      .catch(console.log)
  }

  // setShuffle
  // setRepeat

  static transferPlayback (user, deviceID, play) {
    const argsObject = {
      device_ids: [deviceID],
      play: typeof play === 'boolean' ? play : false
    }
    return this.getSpotifyApi(user)
      .transferMyPlayback(argsObject)
      .then(data => data.body)
      .catch(console.log)
  }

  static getPlaylist (user, playlistID) {
    return this.getSpotifyApi(user)
      .getPlaylist(user.spotifyUser.id, playlistID)
      .then(data => data.body)
      .catch(console.log)
  }

  static getDevices (user) {
    return this.getSpotifyApi(user)
      .getMyDevices()
      .then(data => data.body)
      .catch(console.log)
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
