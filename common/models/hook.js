'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Hook) {
  Hook.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Hook.setAuthorizationCode = function (code, options, cb) {
    const userId = options.accessToken.userId
    spotify.setAuthorizationCode(userId, code)
      .then(results => cb(null, results))
      .catch(error => console.log('Got error!', error))
  }

  Hook.accessToken = function (options, cb) {
    if (!options.accessToken) {
      cb(null, '')
      return
    }
    const userId = options.accessToken.userId
    spotify.getAccessToken(userId)
      .then(token => cb(null, token))
      .catch(error => console.log('Got error!', error))
  }

  Hook.devices = function (options, cb) {
    const userId = options.accessToken.userId
    spotify.getDevices(userId)
      .then(results => cb(null, results))
      .catch(error => console.log('Got error!', error))
  }

  Hook.transferPlayback = function (deviceID, play, options, cb) {
    console.log('Trying to transfer playback to device', deviceID)
    const userId = options.accessToken.userId
    spotify.transferPlayback(userId, deviceID, play)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to transfer playback.', error))
  }

  Hook.play = function (spotifyURI, options, cb) {
    console.log('Trying to play', spotifyURI)
    const userId = options.accessToken.userId
    spotify.play(userId, spotifyURI)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to play song', error))
  }

  Hook.playlists = function (options, cb) {
    const userId = options.accessToken.userId
    spotify.getPlaylists(userId).then(results => {
      cb(null, results)
    })
  }

  Hook.playlist = function (playlistID, options, cb) {
    const userId = options.accessToken.userId
    spotify.getPlaylist(userId, playlistID)
      .then(results => cb(null, results))
      .catch(error => console.log('caught error when trying to get playlist', error))
  }

  Hook.refreshAccessToken = function (options, cb) {
    const userId = options.accessToken.userId
    spotify.refreshToken(userId).then(results => {
      cb(null, results)
    })
  }

  Hook.me = function (options, cb) {
    const userId = options.accessToken.userId
    spotify.getMe(userId)
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
