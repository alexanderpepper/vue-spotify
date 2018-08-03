'use strict'
const moment = require('moment')
const SpotifyService = require('../../server/services/spotify-service')

module.exports = (SpotifyUser) => {
  SpotifyUser.getUserWithFreshToken = (ctx, next) => {
    if (!ctx.args.options || !ctx.req.headers.authorization) {
      return next()
    }
    SpotifyUser.find({where: {'token.accessToken': ctx.req.headers.authorization}}, (err, users) => {
      if (err) {
        return next(err)
      }
      if (!users.length) {
        return next()
      }
      const user = users[0]
      ctx.args.options.user = user
      if (user.token && moment().isSameOrAfter(user.token.expirationDate)) {
        SpotifyService.refreshToken(user).then(refreshedTokenUser => {
          ctx.args.options.user = refreshedTokenUser
          next()
        }).catch(err => console.log(err))
      } else {
        next()
      }
    })
  }
}
