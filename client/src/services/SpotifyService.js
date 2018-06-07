import BaseService from './BaseService'
import api from '../constants/api.js'

class SpotifyService extends BaseService {
  static authorizationUrl () {
    return this.GET(api.authorizationUrl).then(results => results.url)
  }

  static setAuthorizationCode (code) {
    return this.POST(api.setAuthorizationCode, {code})
  }

  static play (spotifyURIs) {
    if (spotifyURIs) {
      return this.POST(api.play, {uris: spotifyURIs}).then(response => response.results)
    } else {
      return this.POST(api.play).then(response => response.results)
    }
  }

  static pause () {
    return this.POST(api.pause).then(response => response.results)
  }

  static next () {
    return this.POST(api.next).then(response => response.results)
  }

  static previous () {
    return this.POST(api.previous).then(response => response.results)
  }

  static setVolume (volume) {
    return this.POST(api.setVolume, {volume}).then(response => response.results)
  }

  static seek (position) {
    return this.POST(api.seek, {position}).then(response => response.results)
  }

  static transferPlayback (deviceID, play) {
    const realPlay = typeof play === 'boolean' ? play : false
    return this.POST(api.transferPlayback(deviceID, realPlay)).then(response => response.results)
  }

  static getDevices () {
    return this.GET(api.devices).then(response => response.results)
  }

  static getPlaylist (playlistID) {
    return this.GET(api.playlist(playlistID)).then(response => response.results)
  }

  static getPlaylists () {
    return this.GET(api.playlists).then(response => response.results)
  }

  static refreshAccessToken () {
    return this.POST(api.refreshAccessToken).then(response => response.results)
  }

  static getPlayerState () {
    return this.GET(api.playerState).then(response => response.results)
  }

  static getPlayingTrack () {
    return this.GET(api.playingTrack).then(response => response.results)
  }
}

export default SpotifyService
