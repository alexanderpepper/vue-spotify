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
      if (err) return next(err)
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
      .catch(error => console.log('Got error!', error))
  }

  Hook.accessToken = function (options, cb) {
    if (!options.user) {
      cb(null, '')
      return
    }
    spotify.getAccessToken(options.user)
      .then(token => cb(null, token))
      .catch(error => console.log('Got error!', error))
  }

  Hook.devices = function (options, cb) {
    spotify.getDevices(options.user)
      .then(results => cb(null, results))
      .catch(error => console.log('Got error!', error))
  }

  Hook.transferPlayback = function (deviceID, play, options, cb) {
    spotify.transferPlayback(options.user, deviceID, play)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to transfer playback.', error))
  }

  Hook.play = function (spotifyURI, options, cb) {
    spotify.play(options.user, spotifyURI)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to play song', error))
  }

  Hook.playlists = function (options, cb) {
    spotify.getPlaylists(options.user).then(results => {
      cb(null, results)
    })
  }

  Hook.playlist = function (playlistID, options, cb) {
    spotify.getPlaylist(options.user, playlistID)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to get playlist', error))
  }

  Hook.refreshAccessToken = function (options, cb) {
    spotify.refreshToken(options.user)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to refresh token', error))
  }

  Hook.me = function (options, cb) {
    spotify.getMe(options.user)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error getting current user', error))
  }

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
      {arg: 'spotifyURI', type: 'string'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/play/:spotifyURI', verb: 'post'}
  })
}
