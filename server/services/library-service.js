const SpotifyService = require('./spotify-service')
const moment = require('moment')
const syncAfterSeconds = 60

module.exports = class LibraryService {
  static get ({user, Library}) {
    return new Promise(resolve => {
      Library.find({where: {userId: user.id}}).then(results => {
        if (!results || !results.length || !results[0].children || !results[0].children.length) {
          SpotifyService.getPlaylists(user).then(playlists => {
            Library.create(this.newLibrary(playlists, user)).then(library => {
              resolve(library)
            })
          })
        } else {
          const library = results[0]
          resolve(moment().isSameOrAfter(library.syncAfter) ? this.sync({user, Library, library}) : library)
        }
      })
    })
  }

  static save ({user, Library, library}) {
    return new Promise(resolve => {
      if (user.id.toString() === library.userId.toString()) {
        Library.upsert(library).then(savedLibrary => {
          resolve(savedLibrary)
        })
      } else {
        resolve(library)
      }
    })
  }

  static async sync ({user, Library, library}) {
    const oldPlaylists = this.flatten(library.children)
    const oldPlaylistIds = oldPlaylists.map(playlist => playlist.data.id)
    const newPlaylists = await SpotifyService.getPlaylists(user)
    const { newPlaylistIds, newPlaylistNames, newPlaylistArtworkUrls } = newPlaylists.reduce((acc, cur) => {
      return {
        newPlaylistIds: acc.newPlaylistIds.concat(cur.id),
        newPlaylistNames: acc.newPlaylistNames.concat(cur.name),
        newPlaylistArtworkUrls: acc.newPlaylistArtworkUrls.concat(cur.images && cur.images.length && cur.images[0].url)
      }
    }, {newPlaylistIds: [], newPlaylistNames: [], newPlaylistArtworkUrls: []})
    const playlistsAdded = newPlaylists.filter(newPlaylist => !oldPlaylistIds.includes(newPlaylist.id))
    const playlistsRemoved = oldPlaylists.filter(oldPlaylist => !newPlaylistIds.includes(oldPlaylist.data.id))

    playlistsAdded.forEach(playlist => library.children.unshift(this.newLibraryPlaylist(playlist)))
    playlistsRemoved.forEach(playlist => this.removePlaylistFromLibrary(library, playlist))

    oldPlaylists
      .filter(playlist => !newPlaylistNames.includes(playlist.title))
      .forEach(playlist => {
        const newPlaylist = newPlaylists.find(p => p.id === playlist.data.id)
        if (newPlaylist) {
          playlist.title = newPlaylist.name
        }
      })

    oldPlaylists
      .filter(playlist => !newPlaylistArtworkUrls.includes(playlist.data.artworkUrl))
      .forEach(playlist => {
        const newPlaylist = newPlaylists.find(p => p.id === playlist.data.id)
        if (newPlaylist) {
          playlist.data.artworkUrl = newPlaylist.images && newPlaylist.images.length && newPlaylist.images[0].url
        }
      })

    library.syncAfter = moment().add(syncAfterSeconds, 'seconds').toDate()

    return this.save({user, Library, library})
  }

  static flatten (children) {
    let result = []
    children.forEach(a => {
      if (a.isLeaf) {
        result.push(a)
      } else if (Array.isArray(a.children)) {
        result = result.concat(this.flatten(a.children))
      }
    })
    return result
  }

  static newLibrary (playlists, user) {
    return {
      userId: user.id,
      syncAfter: moment().add(syncAfterSeconds, 'seconds').toDate(),
      children: playlists.map(this.newLibraryPlaylist)
    }
  }

  static newLibraryPlaylist (playlist) {
    return {
      title: playlist.name,
      isLeaf: true,
      data: {
        id: playlist.id,
        artworkUrl: playlist.images && playlist.images.length && playlist.images[0].url
      }
    }
  }

  static removePlaylistFromLibrary (library, playlist) {
    const searchResults = this.findPlaylistFolder(library, playlist)
    if (searchResults) {
      const {folder, index} = searchResults
      folder.children.splice(index, 1)
    }
  }

  static findPlaylistFolder (folder, playlist) {
    const index = folder.children.indexOf(playlist)
    if (index > -1) {
      return { folder, index }
    } else if (folder.children != null) {
      let result = null
      for (let i = 0; result == null && i < folder.children.length; i++) {
        if (!folder.children[i].isLeaf) {
          result = this.findPlaylistFolder(folder.children[i], playlist)
        }
      }
      return result
    }
  }
}
