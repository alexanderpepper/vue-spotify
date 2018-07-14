import BaseService from './BaseService'
import api from '../constants/api.js'

class PlaylistService extends BaseService {
  static getPlaylist (playlistID) {
    return this.GET(api.playlist(playlistID))
  }
}

export default PlaylistService
