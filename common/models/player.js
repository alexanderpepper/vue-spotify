'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const remoteDefaults = require('../../server/constants/remote-defaults')

module.exports = (Player) => {
  Player.beforeRemote('*', (ctx, unused, next) => Player.app.models.AppUser.getUserWithFreshToken(ctx, next))

  Player.seek = (position, options) => SpotifyService.seek(options.user, position)
  Player.remoteMethod('seek', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'position', type: 'number'},
      remoteDefaults.options
    ],
    http: {path: '/seek', verb: 'post'}
  })

  Player.setVolume = (volume, options) => SpotifyService.setVolume(options.user, volume)
  Player.remoteMethod('setVolume', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'volume', type: 'number'},
      remoteDefaults.options
    ],
    http: {path: '/volume', verb: 'post'}
  })

  Player.playerState = (options) => SpotifyService.getPlaybackState(options.user)
  Player.remoteMethod('playerState', {
    ...remoteDefaults.method,
    http: {path: '/state', verb: 'get'}
  })

  Player.devices = (options) => SpotifyService.getDevices(options.user)
  Player.remoteMethod('devices', {
    ...remoteDefaults.method,
    http: {path: '/devices', verb: 'get'}
  })

  Player.transferPlayback = (deviceID, play, options) => SpotifyService.transferPlayback(options.user, deviceID, play)
  Player.remoteMethod('transferPlayback', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'deviceID', type: 'string'},
      {arg: 'play', type: 'boolean'},
      remoteDefaults.options
    ],
    http: {path: '/transfer/:deviceID/:play', verb: 'post'}
  })

  Player.play = (data, options) => SpotifyService.play(options.user, data)
  Player.remoteMethod('play', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      remoteDefaults.options
    ],
    http: {path: '/play', verb: 'post'}
  })

  Player.pause = (options) => SpotifyService.pause(options.user)
  Player.remoteMethod('pause', {
    ...remoteDefaults.method,
    http: {path: '/pause', verb: 'post'}
  })

  Player.skipToNext = (options) => SpotifyService.skipToNext(options.user)
  Player.remoteMethod('skipToNext', {
    ...remoteDefaults.method,
    http: {path: '/next', verb: 'post'}
  })

  Player.skipToPrevious = (options) => SpotifyService.skipToPrevious(options.user)
  Player.remoteMethod('skipToPrevious', {
    ...remoteDefaults.method,
    http: {path: '/previous', verb: 'post'}
  })
}
