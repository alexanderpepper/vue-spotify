'use strict'
const remoteDefaults = require('../../server/constants/remote-defaults')
const LibraryService = require('../../server/services/library-service')

module.exports = (Library) => {
  Library.beforeRemote('*', (ctx, unused, next) => Library.app.models.AppUser.getUserWithFreshToken(ctx, next))

  Library.get = (options) => LibraryService.get({user: options.user, Library})
  Library.remoteMethod('get', {
    ...remoteDefaults.method,
    accepts: remoteDefaults.options,
    http: {path: '/mine', verb: 'get'}
  })

  Library.post = (library, options) => LibraryService.save({user: options.user, library, Library})
  Library.remoteMethod('post', {
    ...remoteDefaults.method,
    accepts: [
      {arg: 'library', type: 'object', http: {source: 'body'}},
      remoteDefaults.options
    ],
    http: {path: '/mine', verb: 'post'}
  })
}
