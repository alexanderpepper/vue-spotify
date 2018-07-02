'use strict'
const remoteDefaults = require('../../server/constants/remote-defaults')

module.exports = (Folder) => {
  Folder.beforeRemote('*', (ctx, unused, next) => Folder.app.models.AppUser.getUserWithFreshToken(ctx, next))

  Folder.get = (options) => Folder.find({where: {userId: {like: options.user.id}}}).then(results => results[0])
  Folder.remoteMethod('get', {
    ...remoteDefaults.method,
    accepts: remoteDefaults.options,
    http: {path: '/my', verb: 'get'}
  })
}
