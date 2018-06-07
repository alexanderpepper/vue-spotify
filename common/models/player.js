'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Player) {
  Player.beforeRemote('*', (ctx, unused, next) => {
    Player.app.models.AppUser.getUserWithFreshToken(ctx, next)
  })

  Player.devices = function (options, cb) {
    spotify.getDevices(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.transferPlayback = function (deviceID, play, options, cb) {
    spotify.transferPlayback(options.user, deviceID, play)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.play = function (data, options, cb) {
    spotify.play(options.user, data)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.pause = function (options, cb) {
    spotify.pause(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.skipToNext = function (options, cb) {
    spotify.skipToNext(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.skipToPrevious = function (options, cb) {
    spotify.skipToPrevious(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.playerState = function (options, cb) {
    spotify.getPlaybackState(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.seek = function (position, options, cb) {
    console.log(`called seek with position: ${position}`)
    spotify.seek(options.user, position)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.setVolume = function (volume, options, cb) {
    console.log(`called setVolume with volume: ${volume}`)
    spotify.setVolume(options.user, volume)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Player.remoteMethod('seek', {
    accepts: [
      {arg: 'position', type: 'number'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/seek', verb: 'post'}
  })

  Player.remoteMethod('setVolume', {
    accepts: [
      {arg: 'volume', type: 'number'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/volume', verb: 'post'}
  })

  Player.remoteMethod('playerState', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/state', verb: 'get'}
  })

  Player.remoteMethod('devices', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/devices', verb: 'get'}
  })

  Player.remoteMethod('transferPlayback', {
    accepts: [
      {arg: 'deviceID', type: 'string'},
      {arg: 'play', type: 'boolean'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/transfer/:deviceID/:play', verb: 'post'}
  })

  Player.remoteMethod('play', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/play', verb: 'post'}
  })

  Player.remoteMethod('pause', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/pause', verb: 'post'}
  })

  Player.remoteMethod('skipToNext', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/next', verb: 'post'}
  })

  Player.remoteMethod('skipToPrevious', {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/previous', verb: 'post'}
  })
}
