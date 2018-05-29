const TokenService = require('./token-service')
const SpotifyWebApi = require('spotify-web-api-node')
const {clientId, clientSecret, redirectUri} = require('../constants/credentials')
const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'playlist-read-private', 'user-read-playback-state', 'user-modify-playback-state']
const limit = 50

module.exports = class SpotifyService {
  getSpotifyApi (user) {
    const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
    const token = user && user.spotifyUser && user.spotifyUser.token
    if (token) {
      // console.log(`using token for ${user.email}: ${token.accessToken}`)
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)
    }
    return spotifyApi
  }

  getAuthorizationUrl () {
    return new SpotifyWebApi({clientId, redirectUri}).createAuthorizeURL(scopes, 'some-state-of-my-choice')
  }

  async setAuthorizationCode (user, code) {
    try {
      const spotifyApi = new SpotifyWebApi({clientId, clientSecret, redirectUri})
      const tokenResponse = await spotifyApi.authorizationCodeGrant(code)
      const token = TokenService.create(tokenResponse.body)
      spotifyApi.setAccessToken(token.accessToken)
      spotifyApi.setRefreshToken(token.refreshToken)

      const spotifyUser = await spotifyApi.getMe().then(data => data.body)
      user.spotifyUser = {...spotifyUser, token}

      return new Promise(resolve => {
        user.save().then(() => resolve())
      })
    } catch (error) {
      console.log('Something went wrong!', error)
    }
  }

  async refreshToken (user) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const data = await spotifyApi.refreshAccessToken()
      const token = TokenService.create(data.body)
      user.spotifyUser.token.accessToken = token.accessToken
      user.spotifyUser.token.expirationDate = token.expirationDate
      if (token.refreshToken) {
        user.spotifyUser.token.refreshToken = token.refreshToken
      }
      return new Promise(resolve => {
        user.save().then(saved => resolve(saved))
      })
    } catch (error) {
      console.log('Could not refresh access token', JSON.stringify(error))
    }
  }

  async getAccessToken (user) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      return spotifyApi.getAccessToken()
    } catch (error) {
      console.log('Something went wrong getting access token', error)
    }
  }

  async getMe (user) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const response = await spotifyApi.getMe().then(data => data.body)
      return response
    } catch (error) {
      console.log('Something went wrong getting user spotify account', error)
    }
  }

  async play (user, data) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const response = spotifyApi.play(data).then(data => data.body)
      return response
    } catch (error) {
      console.log('Something went wrong trying to play', error)
    }
  }

  async transferPlayback (user, deviceID, play) {
    try {
      let argsObject = {device_ids: [ deviceID ]}
      argsObject.play = typeof play === 'boolean' ? play : false
      const spotifyApi = this.getSpotifyApi(user)
      const response = await spotifyApi.transferMyPlayback(argsObject).then(data => data.body)
      return response
    } catch (error) {
      console.log('Something went wrong transferring playback', error)
    }
  }

  async getPlaylist (user, playlistID) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const playlist = await spotifyApi.getPlaylist(user.spotifyUser.id, playlistID).then(data => data.body)
      return playlist
    } catch (error) {
      console.log('Something went wrong getting a playlist', error)
    }
  }

  async getDevices (user) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const devices = await spotifyApi.getMyDevices().then(data => data.body)
      return devices
    } catch (error) {
      console.log('Something went wrong getting devices', error)
    }
  }

  async getPlaylists (user) {
    try {
      const spotifyApi = this.getSpotifyApi(user)
      const sampling = await spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit: 1}).then(data => data.body)
      const pageCount = Math.ceil(sampling.total / limit)
      const pages = Array.from(Array(pageCount).keys())
      const promises = pages.map(p => spotifyApi.getUserPlaylists(user.spotifyUser.id, {limit, offset: p * limit}).then(data => data.body.items))
      return Promise.all(promises).then(results => results.reduce((acc, val) => acc.concat(val)))
    } catch (error) {
      console.log('Something went wrong getting playlists', error)
    }
  }
}
