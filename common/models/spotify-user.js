'use strict'
const moment = require('moment')
const SpotifyService = require('../../server/services/spotify-service')

module.exports = (SpotifyUser) => {
  SpotifyUser.getUserWithFreshToken = (ctx, next) => {
    if (!ctx.args.options || !ctx.req.headers.authorization) {
      return next()
    }

    getSpotifyUser(ctx.req.headers.authorization, SpotifyUser.app.models.SpotifyAccessToken).then(user => {
      if (!user) {
        return next()
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
    .catch(err => {
      return next(err)
    })
  }

  async function getSpotifyUser (accessToken, SpotifyAccessToken) {
    return new Promise((resolve, reject) => {
      SpotifyAccessToken.find({where: {accessToken}, include: 'user'}, (err, tokens) => {
        if (err) {
          reject(err)
        } else {
          resolve(tokens.length && tokens[0].toJSON().user)
        }
      })
    })
  }
}
