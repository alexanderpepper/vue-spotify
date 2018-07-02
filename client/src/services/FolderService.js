import BaseService from './BaseService'
import api from '../constants/api.js'

class FolderService extends BaseService {
  static get () {
    return this.GET(api.myFolders)
  }

  static save (folders) {
    if (folders.id) {
      return this.PATCH(api.folder(folders.id), folders)
    } else {
      return this.POST(api.folders, folders)
    }
  }

  static fromPlaylists (playlists, user) {
    return {
      userId: user.id,
      folders: playlists.map(playlist => {
        return {
          title: playlist.name,
          isLeaf: true,
          data: playlist.id
        }
      })
    }
  }
}

export default FolderService
