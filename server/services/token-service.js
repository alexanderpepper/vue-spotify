const moment = require('moment')
module.exports = class TokenService {
  static create (token) {
    const accessToken = token['access_token']
    const refreshToken = token['refresh_token']
    const expiresIn = token['expires_in']
    const expirationDate = moment().add(expiresIn * 0.9, 'seconds').toDate()
    // const expirationDate = moment().add(3, 'seconds').toDate()
    return { expirationDate, accessToken, refreshToken }
  }
}
