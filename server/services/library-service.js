const SpotifyService = require('./spotify-service')

module.exports = class LibraryService {
  static get ({user, Library}) {
    return new Promise(resolve => {
      Library.find({where: {userId: user.id}}).then(results => {
        if (!results || !results.length || !results[0].children || !results[0].children.length) {
          SpotifyService.getPlaylists(user).then(playlists => {
            Library.create(this.fromPlaylists(playlists, user)).then(library => {
              resolve(library)
            })
          })
        } else {
          resolve(results[0])
        }
      })
    })
  }

  static save ({user, Library, library}) {
    return new Promise(resolve => {
      if (user.id.toString() === library.userId) {
        Library.upsert(library).then(savedLibrary => {
          resolve(savedLibrary)
        })
      }
    })
  }

  static fromPlaylists (playlists, user) {
    return {
      userId: user.id,
      children: playlists.map(playlist => {
        return {
          title: playlist.name,
          isLeaf: true,
          data: {
            id: playlist.id,
            artworkUrl: playlist.images && playlist.images.length && playlist.images[0].url
          }
        }
      })
    }
  }
}
