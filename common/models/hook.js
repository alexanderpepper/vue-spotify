'use strict'

const moment = require('moment')
const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Hook) {
  Hook.beforeRemote('*', (ctx, unused, next) => {
    if (!ctx.args.options || !ctx.args.options.accessToken) {
      return next()
    }
    const AppUser = Hook.app.models.AppUser
    AppUser.findById(ctx.args.options.accessToken.userId, (err, user) => {
      if (err) {
        return next(err)
      }
      ctx.args.options.user = user
      if (user.spotifyUser && moment().isSameOrAfter(user.spotifyUser.token.expirationDate)) {
        spotify.refreshToken(user).then(refreshedTokenUser => {
          ctx.args.options.user = refreshedTokenUser
          next()
        })
      } else {
        next()
      }
    })
  })

  Hook.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Hook.setAuthorizationCode = function (code, options, cb) {
    spotify.setAuthorizationCode(options.user, code)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.accessToken = function (options, cb) {
    if (!options.user) {
      cb(null, '')
      return
    }
    spotify.getAccessToken(options.user)
      .then(token => cb(null, token))
      .catch(error => cb(error))
  }

  Hook.devices = function (options, cb) {
    spotify.getDevices(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.transferPlayback = function (deviceID, play, options, cb) {
    spotify.transferPlayback(options.user, deviceID, play)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.play = function (data, options, cb) {
    spotify.play(options.user, data)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.pause = function (options, cb) {
    spotify.pause(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.skipToNext = function (options, cb) {
    spotify.skipToNext(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.skipToPrevious = function (options, cb) {
    spotify.skipToPrevious(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.playlists = function (options, cb) {
    spotify.getPlaylists(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.playlist = function (playlistID, options, cb) {
    spotify.getPlaylist(options.user, playlistID)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.refreshAccessToken = function (options, cb) {
    spotify.refreshToken(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.me = function (options, cb) {
    spotify.getMe(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.playerState = function (options, cb) {
    spotify.getPlaybackState(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.playingTrack = function (options, cb) {
    spotify.getPlayingTrack(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.seek = function (position, options, cb) {
    console.log(`called seek with position: ${position}`)
    spotify.seek(options.user, position)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.setVolume = function (volume, options, cb) {
    console.log(`called setVolume with volume: ${volume}`)
    spotify.setVolume(options.user, volume)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Hook.remoteMethod('seek', {
    accepts: [
      {arg: 'position', type: 'number'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/seek', verb: 'post'}
  })

  Hook.remoteMethod('setVolume', {
    accepts: [
      {arg: 'volume', type: 'number'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/set-volume', verb: 'post'}
  })

  Hook.remoteMethod('playerState', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/player-state', verb: 'get'}
  })

  Hook.remoteMethod('playingTrack', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/playing-track', verb: 'get'}
  })

  Hook.remoteMethod('me', {
    returns: {arg: 'results', type: 'object'},
    http: {path: '/me', verb: 'get'}
  })

  Hook.remoteMethod('authorizationUrl', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/authorization-url', verb: 'get'}
  })

  Hook.remoteMethod('accessToken', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'url', type: 'string'},
    http: {path: '/access-token', verb: 'get'}
  })

  Hook.remoteMethod('refreshAccessToken', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/refresh-access-token', verb: 'post'}
  })

  Hook.remoteMethod('setAuthorizationCode', {
    accepts: [
      {arg: 'code', type: 'string'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/set-authorization-code', verb: 'post'}
  })

  Hook.remoteMethod('devices', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/devices', verb: 'get'}
  })

  Hook.remoteMethod('playlists', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/playlists', verb: 'get'}
  })

  Hook.remoteMethod('playlist', {
    accepts: [
      {arg: 'playlistID', type: 'string'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/playlist/:playlistID', verb: 'get'}
  })

  Hook.remoteMethod('transferPlayback', {
    accepts: [
      {arg: 'deviceID', type: 'string'},
      {arg: 'play', type: 'boolean'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/transferPlayback/:deviceID/:play', verb: 'post'}
  })

  Hook.remoteMethod('play', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/play', verb: 'post'}
  })

  Hook.remoteMethod('pause', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/pause', verb: 'post'}
  })

  Hook.remoteMethod('skipToNext', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/next', verb: 'post'}
  })

  Hook.remoteMethod('skipToPrevious', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/previous', verb: 'post'}
  })
}
