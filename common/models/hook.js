'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Hook) {

  Hook.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Hook.remoteMethod('authorizationUrl', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/authorization-url', verb: 'get'}
  })

  Hook.setAuthorizationCode = function (code, cb) {
    spotify.setAuthorizationCode(code).then(results => {
      console.log(results)
      cb(null, results)
    })
  }

  Hook.remoteMethod('setAuthorizationCode', {
    accepts: [{arg: 'code', type: 'string'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/set-authorization-code', verb: 'post'}
  })
}
