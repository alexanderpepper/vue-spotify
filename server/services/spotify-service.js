const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const moduleExists = require('../constants/module-exists')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state']
const limit = 50
const logging = false
const resolver = (promise) => promise.then(data => data.body).catch(this.log)

const credentials = moduleExists('../constants/credentials') ? require('../constants/credentials') : undefined

if (!credentials || !credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
  console.error('Aborting: Please create server/constants/credentials.js as specified in README.md')
  process.abort()
}

const {clientId, clientSecret, redirectUri} = credentials
module.exports = class SpotifyService {

  static log (...str) {
    if (logging) {
      console.log(str)
    }
  }

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
    this.log('getAuthorizationUrl')
    return new SpotifyWebApi({clientId, redirectUri}).createAuthorizeURL(scopes, 'new-spotify-utils-user')
  }

  static async setAuthorizationCode (user, code) {
    this.log('setAuthorizationCode')
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
    this.log('refreshToken')
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
    this.log('play')
    return resolver(this.getSpotifyApi(user).play(songs))
  }

  static async shuffleFolder (user, path, Library) {
    this.log('shuffleFolder')
    const library = await this.getLibrary(user, Library);
    const folder = path.reduce((node, index) => node.children[index], library)
    const playlists = await Promise.all(this.flatten(folder.children).map(item => this.getPlaylist(user, item.data.id)))
    const uris = playlists.map(playlist => playlist.tracks.items.map(item => item.track.uri)).reduce((acc, cur) => acc.concat(cur), [])
    await this.setShuffle(user, true)
    return this.play(user, {uris})
  }

  static getLibrary (user, Library) {
    return new Promise(resolve => {
      Library.find({where: {userId: user.id}}).then(results => results && results[0]).then(resolve)
    })
  }

  static flatten (children) {
    let result = []
    children.forEach(a => {
      if (a.isLeaf) {
        result.push(a)
      } else if (Array.isArray(a.children)) {
        result = result.concat(this.flatten(a.children))
      }
    })
    return result
  }

  static pause (user) {
    this.log('pause')
    return resolver(this.getSpotifyApi(user).pause())
  }

  static skipToNext (user) {
    this.log('skipToNext')
    return resolver(this.getSpotifyApi(user).skipToNext())
  }

  static skipToPrevious (user) {
    this.log('skipToPrevious')
    return resolver(this.getSpotifyApi(user).skipToPrevious())
  }

  static getPlaybackState (user) {
    this.log('getPlaybackState')
    return resolver(this.getSpotifyApi(user).getMyCurrentPlaybackState())
  }

  static seek (user, position) {
    this.log('seek')
    return resolver(this.getSpotifyApi(user).seek(position))
  }

  static setVolume (user, volume) {
    this.log('setVolume')
    return resolver(this.getSpotifyApi(user).setVolume(volume))
  }

  static setShuffle (user, shuffle) {
    this.log('setShuffle')
    return resolver(this.getSpotifyApi(user).setShuffle({state: shuffle}))
  }

  static setRepeat (user, repeat) {
    this.log('setRepeat')
    return resolver(this.getSpotifyApi(user).setRepeat({state: repeat}))
  }

  static transferPlayback (user, deviceID, play) {
    this.log('transferPlayback')
    const argsObject = {
      device_ids: [deviceID],
      play: typeof play === 'boolean' ? play : false
    }
    return resolver(this.getSpotifyApi(user).transferMyPlayback(argsObject))
  }

  static getPlaylist (user, playlistID) {
    this.log('getPlaylist: ' + playlistID)
    return resolver(this.getSpotifyApi(user).getPlaylist(user.spotifyUser.id, playlistID))
  }

  static getDevices (user) {
    this.log('getDevices')
    return resolver(this.getSpotifyApi(user).getMyDevices())
  }

  static async getPlaylists (user) {
    this.log('getPlaylists')
    const spotifyApi = this.getSpotifyApi(user)
    const sampling = await spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit: 1}).then(data => data.body)
    const pageCount = Math.ceil(sampling.total / limit)
    const pages = Array.from(Array(pageCount).keys())
    const promises = pages.map(p => spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit, offset: p * limit}).then(data => data.body.items))
    return Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val))).catch(this.log)
  }
}
