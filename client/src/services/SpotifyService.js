import BaseService from './BaseService'
import api from '../constants/api.js'

class SpotifyService extends BaseService {
  static authorizationUrl () {
    return this.GET(api.authorizationUrl).then(results => results.url)
  }

  static setAuthorizationCode (code) {
    return this.POST(api.setAuthorizationCode, {code})
  }

  static getAccessToken () {
    return this.GET(api.accessToken)
  }

  static play (spotifyURI) {
    return this.POST(api.play(spotifyURI)).then(response => response.results)
  }

  static transferPlayback (deviceID, play) {
    const realPlay = typeof play === 'boolean' ? play : false
    console.log('realPlay', realPlay, 'deviceID', deviceID)

    return this.POST(api.transferPlayback(deviceID, realPlay)).then(response => response.results)
  }

  static getDevices () {
    return this.GET(api.devices).then(response => response.results)
  }

  static getPlaylist (playlistID) {
    return this.GET(api.playlist(playlistID)).then(response => response.results)
  }

  static getPlaylists () {
    return this.GET(api.playlists)
  }

  static getCurrentSpotifyUser () {
    return this.GET(api.currentSpotifyUser).then(response => response.results)
  }

  static refreshAccessToken () {
    return this.POST(api.refreshAccessToken).then(response => response.results)
  }
}

export default SpotifyService
