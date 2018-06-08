import BaseService from './BaseService'
import api from '../constants/api.js'

class PlaylistService extends BaseService {
  static getPlaylist (playlistID) {
    return this.GET(api.playlist(playlistID)).then(response => response.results)
  }

  static getPlaylists () {
    return this.GET(api.playlists).then(response => response.results)
  }
}

export default PlaylistService
