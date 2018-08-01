'use strict'
const moment = require('moment')
const SpotifyService = require('../../server/services/spotify-service')

module.exports = (SpotifyUser) => {
  SpotifyUser.getUserWithFreshToken = (ctx, next) => {
    if (!ctx.args.options || !ctx.args.options.accessToken) {
      return next()
    }
    SpotifyUser.findById(ctx.args.options.accessToken.userId, (err, user) => {
      if (err) {
        return next(err)
      }
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
