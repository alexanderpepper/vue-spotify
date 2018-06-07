'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Playlist) {
  Playlist.beforeRemote('*', (ctx, unused, next) => {
    Playlist.app.models.AppUser.getUserWithFreshToken(ctx, next)
  })

  Playlist.playlists = function (options, cb) {
    spotify.getPlaylists(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Playlist.playlist = function (playlistID, options, cb) {
    spotify.getPlaylist(options.user, playlistID)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Playlist.remoteMethod('playlists', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/', verb: 'get'}
  })

  Playlist.remoteMethod('playlist', {
    accepts: [
      {arg: 'playlistID', type: 'string'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/:playlistID', verb: 'get'}
  })
}
