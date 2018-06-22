import BaseService from './BaseService'
import api from '../constants/api.js'

class FolderService extends BaseService {
  static all () {
    return this.GET(api.folders)
  }

  static get (id) {
    return this.GET(api.folder(id))
  }

  static save (folder) {
    if (folder.id) {
      return this.PATCH(api.folder(folder.id), folder)
    } else {
      return this.POST(api.folders, folder)
    }
  }

  static remove (folder) {
    return this.DELETE(api.folder(folder.id))
  }

  static fromPlaylists (playlists) {
    return playlists.map(playlist => {
      return {
        title: playlist.name,
        isLeaf: true,
        data: playlist.id
      }
    })
  }
}

export default FolderService
