'use strict'
const moment = require('moment')
const SpotifyService = require('../../server/services/spotify-service')
const remoteDefaults = require('../../server/constants/remote-defaults')

module.exports = (AppUser) => {
  AppUser.settings.acls.length = 0
  AppUser.settings.acls = require('./app-user-acl.json')

  AppUser.getUserWithFreshToken = (ctx, next) => {
    if (!ctx.args.options || !ctx.args.options.accessToken) {
      return next()
    }
    AppUser.findById(ctx.args.options.accessToken.userId, (err, user) => {
      if (err) {
        return next(err)
      }
      ctx.args.options.user = user
      if (user.spotifyUser && moment().isSameOrAfter(user.spotifyUser.token.expirationDate)) {
        SpotifyService.refreshToken(user).then(refreshedTokenUser => {
          ctx.args.options.user = refreshedTokenUser
          next()
        }).catch(err => console.log(err))
      } else {
        next()
      }
    })
  }

  AppUser.paginated = (filter, cb) => {
    const query = {
      where: {
        and: [
          { name: { like: filter.name, options: 'i' } },
          { email: { like: filter.email, options: 'i' } }
        ]
      },
      limit: filter.limit,
      skip: (filter.page - 1) * filter.limit,
      include: {
        relation: 'roleMappings',
        scope: {
          include: {
            relation: 'role'
          }
        }
      }
    }

    const addRoleFilter = async () => {
      const roleMappings = await AppUser.app.models.AppRoleMapping.find({ roleId: filter.role })
      const userIds = roleMappings.map(r => r.principalId)
      query.where.and.push({ id: { inq: userIds } })
    }

    const find = async () => {
      const results = await Promise.all([
        AppUser.find(query),
        AppUser.count(query.where)
      ])
      const users = results[0]
      const pageCount = Math.ceil(results[1] / query.limit)
      cb(null, { users, pageCount })
    }

    if (filter.role) {
      addRoleFilter().then(find)
    } else {
      find()
    }
  }

  AppUser.remoteMethod('paginated', {
    accepts: [{arg: 'filter', type: 'object'}],
    returns: remoteDefaults.returns
  })
}
