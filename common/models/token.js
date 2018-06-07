'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Token) {
  Token.beforeRemote('*', (ctx, unused, next) => {
    Token.app.models.AppUser.getUserWithFreshToken(ctx, next)
  })

  Token.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Token.setAuthorizationCode = function (code, options, cb) {
    spotify.setAuthorizationCode(options.user, code)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Token.me = function (options, cb) {
    spotify.getMe(options.user)
      .then(results => cb(null, results))
      .catch(error => cb(error))
  }

  Token.remoteMethod('me', {
    returns: {arg: 'results', type: 'object'},
    http: {path: '/me', verb: 'get'}
  })

  Token.remoteMethod('authorizationUrl', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/authorization-url', verb: 'get'}
  })

  Token.remoteMethod('setAuthorizationCode', {
    accepts: [
      {arg: 'code', type: 'string'},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}
    ],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/authorization-code', verb: 'post'}
  })
}
