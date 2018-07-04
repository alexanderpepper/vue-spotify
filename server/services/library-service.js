const SpotifyService = require('./spotify-service')

module.exports = class LibraryService {
  static get ({user, Library}) {
    return new Promise(resolve => {
      console.log(user.id)
      Library.find({where: {userId: user.id}}).then(results => {
        if (!results || !results.length || !results[0].children || !results[0].children.length) {
          SpotifyService.getPlaylists(user).then(playlists => {
            Library.create(this.fromPlaylists(playlists, user)).then(library => {
              console.log('Got GET - Built: ' + library.userId)
              resolve(library)
            })
          })
        } else {
          console.log('Got GET - Found')
          resolve(results[0])
        }
      })
    })
  }

  static save ({user, Library, library}) {
    return new Promise(resolve => {
      if (user.id === library.userId) {
        Library.save(library).then(savedLibrary => {
          console.log('Got POST')
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
