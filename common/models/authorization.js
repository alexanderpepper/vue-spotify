'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const remoteDefaults = require('../../server/constants/remote-defaults')

module.exports = (Authorization) => {
  Authorization.beforeRemote('*', (ctx, unused, next) => Authorization.app.models.AppUser.getUserWithFreshToken(ctx, next))

  Authorization.getAuthorizationUrl = (cb) => { cb(null, SpotifyService.getAuthorizationUrl()) }
  Authorization.remoteMethod('getAuthorizationUrl', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/url', verb: 'get'}
  })

  Authorization.setAuthorizationCode = (code, options) => SpotifyService.setAuthorizationCode(options.user, code)
  Authorization.remoteMethod('setAuthorizationCode', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'code', type: 'string'},
      remoteDefaults.options
    ],
    http: {path: '/code', verb: 'post'}
  })
}
