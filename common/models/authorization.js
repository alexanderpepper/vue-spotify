'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const remoteDefaults = require('../../server/constants/remote-defaults')

module.exports = (Authorization) => {
  Authorization.beforeRemote('*', (ctx, unused, next) => Authorization.app.models.SpotifyUser.getUserWithFreshToken(ctx, next))

  // Authorization.getAuthorizationUrl = (cb) => { cb(null, {url: SpotifyService.getAuthorizationUrl()}) }
  Authorization.getAuthorizationUrl = () => new Promise(resolve => resolve({url: SpotifyService.getAuthorizationUrl()}))
  Authorization.remoteMethod('getAuthorizationUrl', {
    returns: remoteDefaults.returns,
    http: {path: '/url', verb: 'get'}
  })

  Authorization.setAuthorizationCode = (code) => SpotifyService.setAuthorizationCode(code, Authorization.app.models.SpotifyUser)
  Authorization.remoteMethod('setAuthorizationCode', {
    ...remoteDefaults.method,
    accepts: [{arg: 'code', type: 'string'}],
    http: {path: '/code', verb: 'post'}
  })

  Authorization.getMe = (options) => new Promise(resolve => resolve(options.user))
  Authorization.remoteMethod('getMe', {
    ...remoteDefaults.method,
    accepts: [remoteDefaults.options],
    http: {path: '/me', verb: 'get'}
  })

}
