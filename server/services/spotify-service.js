const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const moduleExists = require('../constants/module-exists')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state']
const limit = 50
const logging = false
const log = (str) => logging && console.log(str)
const resolver = (promise) => promise.then(data => data.body).catch(console.log)
const credentials = moduleExists('../constants/credentials') ? require('../constants/credentials') : undefined

if (!credentials || !credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
  console.error('Aborting: Please create server/constants/credentials.js as specified in README.md')
  process.abort()
}

const {clientId, clientSecret, redirectUri} = credentials

module.exports = class SpotifyService {
  static getSpotifyApi (user) {
    const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    const token = user && user.token
    if (token) {
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)
    }
    return spotifyApi
  }

  static getAuthorizationUrl () {
    log('getAuthorizationUrl')
    return new SpotifyWebApi({clientId, redirectUri}).createAuthorizeURL(scopes, 'new-spotify-utils-user')
  }

  static async setAuthorizationCode ({ code, SpotifyUser, SpotifyAccessToken }) {
    log('setAuthorizationCode')

    const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})

    console.log(redirectUri)

    let tokenResponse
    try {
      tokenResponse = await spotifyApi.authorizationCodeGrant(code)
    } catch (error) {
      console.log(error)
    }
    const token = TokenService.create(tokenResponse.body)
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const spotifyUser = await spotifyApi.getMe().then(data => data.body)
    spotifyUser.token = token

    await this.createSpotifyAccessToken(spotifyUser.id, token.accessToken, SpotifyAccessToken)

    return new Promise(resolve => SpotifyUser.upsert(spotifyUser).then(resolve))
  }

  static async createSpotifyAccessToken (userId, accessToken, SpotifyAccessToken) {
    return new Promise(resolve => {
      SpotifyAccessToken.create({userId, accessToken}).then(resolve)
    })
  }

  static async refreshToken ({user, SpotifyUser, SpotifyAccessToken}) {
    const data = await resolver(this.getSpotifyApi(user).refreshAccessToken())

    if (!data) return user

    const token = TokenService.create(data)
    user.token.accessToken = token.accessToken
    user.token.expirationDate = token.expirationDate
    if (token.refreshToken) {
      user.token.refreshToken = token.refreshToken
    }

    await this.createSpotifyAccessToken(user.id, token.accessToken, SpotifyAccessToken)

    return new Promise(resolve => {
      SpotifyUser.upsert(user).then(savedUser => resolve(savedUser))
    })
  }

  static play (user, songs) {
    log('play')
    return resolver(this.getSpotifyApi(user).play(songs))
  }

  static pause (user) {
    log('pause')
    return resolver(this.getSpotifyApi(user).pause())
  }

  static skipToNext (user) {
    log('skipToNext')
    return resolver(this.getSpotifyApi(user).skipToNext())
  }

  static skipToPrevious (user) {
    log('skipToPrevious')
    return resolver(this.getSpotifyApi(user).skipToPrevious())
  }

  static getPlaybackState (user) {
    log('getPlaybackState')
    return resolver(this.getSpotifyApi(user).getMyCurrentPlaybackState())
  }

  static seek (user, position) {
    log('seek')
    return resolver(this.getSpotifyApi(user).seek(position))
  }

  static setVolume (user, volume) {
    log('setVolume')
    return resolver(this.getSpotifyApi(user).setVolume(volume))
  }

  static setShuffle (user, shuffle) {
    log('setShuffle')
    return resolver(this.getSpotifyApi(user).setShuffle({state: shuffle}))
  }

  static setRepeat (user, repeat) {
    log('setRepeat')
    return resolver(this.getSpotifyApi(user).setRepeat({state: repeat}))
  }

  static transferPlayback (user, deviceID, play) {
    log('transferPlayback')
    const argsObject = {
      device_ids: [deviceID],
      play: typeof play === 'boolean' ? play : false
    }
    return resolver(this.getSpotifyApi(user).transferMyPlayback(argsObject))
  }

  static getPlaylist (user, playlistID) {
    log('getPlaylist: ' + playlistID)
    return resolver(this.getSpotifyApi(user).getPlaylist(user.id, playlistID))
  }

  static getDevices (user) {
    log('getDevices')
    return resolver(this.getSpotifyApi(user).getMyDevices())
  }

  static async getPlaylists (user) {
    const spotifyApi = this.getSpotifyApi(user)
    const sampling = await spotifyApi.getUserPlaylists(user.id, {limit: 1}).then(data => data.body)
    const pageCount = Math.ceil(sampling.total / limit)
    const pages = Array.from(Array(pageCount).keys())
    const promises = pages.map(p => spotifyApi.getUserPlaylists(user.id, {limit, offset: p * limit}).then(data => data.body.items))
    return Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val), [])).catch(console.log)
  }

  static async getAll (user) {
    log('getAll')
    const spotifyApi = this.getSpotifyApi(user)
    const sampling = await spotifyApi.getUserPlaylists(user.id, {limit: 1}).then(data => data.body)
    const pageCount = Math.ceil(sampling.total / limit)
    const pages = Array.from(Array(pageCount).keys())
    const promises = pages.map(p => spotifyApi.getUserPlaylists(user.id, {limit, offset: p * limit}).then(data => data.body.items))
    const playlists = await Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val), [])).catch(console.log)

    const results = []
    for (const { id, name } of playlists) {
      const trackSampling = await spotifyApi.getPlaylistTracks(id, {limit: 1}).then(res => res.body)
      const trackPageCount = Math.ceil(trackSampling.total / limit)
      const trackPages = Array.from(Array(trackPageCount).keys())
      const trackPromises = trackPages.map(p => spotifyApi.getPlaylistTracks(id, {limit, offset: p * limit}).then(data => data.body.items))
      const trackItems = await Promise.all(trackPromises).then(results => results.reduce((acc, val) => acc.concat(val), []))

      if (name === 'Release Radar') {
        continue;
      }

      const tracks = trackItems.map(({ track: { name: trackName, artists, album }}) => ({
        trackName,
        artist: artists.map(({ name }) => name).join(','),
        album: album.name
      }))

      console.log(name, ':', tracks.length, 'tracks')
      results.push({ name, tracks })
    }

    return results
  }
}
