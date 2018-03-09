'use strict'

const SpotifyService = require('../../server/services/SpotifyService')
const spotify = new SpotifyService()

module.exports = function (Hook) {

  Hook.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Hook.remoteMethod('authorizationUrl', {
    returns: {arg: 'results', type: 'object'},
    http: {path: '/authorization-url', verb: 'get'}
  })

  Hook.setAuthorizationCode = function (cb) {

  }
}
