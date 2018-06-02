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
      console.log('Error: spotify-service.refreshToken()', error)
    }
  }

  async refreshToken (user) {
    try {
      const data = await this.getSpotifyApi(user).refreshAccessToken().then(data => data.body)
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
      console.log('Error: spotify-service.refreshToken()', error)
    }
  }

  async getAccessToken (user) {
    try {
      return this.getSpotifyApi(user).getAccessToken()
    } catch (error) {
      console.log('Error: spotify-service.getAccessToken()', error)
    }
  }

  async getMe (user) {
    try {
      return await this.getSpotifyApi(user).getMe().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.getMe()', error)
    }
  }

  async play (user, uris) {
    try {
      return await this.getSpotifyApi(user).play(uris).then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.play()', error)
    }
  }

  async pause (user) {
    try {
      return await this.getSpotifyApi(user).pause().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.pause()', error)
    }
  }

  async skipToNext (user) {
    try {
      return await this.getSpotifyApi(user).skipToNext().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.skipToNext()', error)
    }
  }

  async skipToPrevious (user) {
    try {
      return await this.getSpotifyApi(user).skipToPrevious().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.skipToPrevious()', error)
    }
  }

  async getPlaybackState (user) {
    try {
      return await this.getSpotifyApi(user).getMyCurrentPlaybackState().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.getPlaybackState()', error)
    }
  }

  async getPlayingTrack (user) {
    try {
      return await this.getSpotifyApi(user).getMyCurrentPlayingTrack().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.getPlayingTrack()', error)
    }
  }

  async seek (user, position) {
    try {
      return await this.getSpotifyApi(user).seek(position).then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.seek()', error)
    }
  }

  async setVolume (user, volume) {
    try {
      return await this.getSpotifyApi(user).setVolume(volume).then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.setVolume()', error)
    }
  }

  // setShuffle
  // setRepeat

  async transferPlayback (user, deviceID, play) {
    try {
      const argsObject = {
        device_ids: [ deviceID ],
        play: typeof play === 'boolean' ? play : false
      }
      return await this.getSpotifyApi(user).transferMyPlayback(argsObject).then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.transferPlayback()', error)
    }
  }

  async getPlaylist (user, playlistID) {
    try {
      return await this.getSpotifyApi(user).getPlaylist(user.spotifyUser.id, playlistID).then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.getPlaylist()', error)
    }
  }

  async getDevices (user) {
    try {
      return await this.getSpotifyApi(user).getMyDevices().then(data => data.body)
    } catch (error) {
      console.log('Error: spotify-service.getDevices()', error)
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
      console.log('Error: spotify-service.getPlaylists()', error)
    }
  }
}
