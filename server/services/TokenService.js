module.exports = class TokenService {
  static setToken (token) {
    window.localStorage['token'] = JSON.stringify(token)
    return this.normalize(token)
  }

  static getToken () {
    const token = JSON.parse(window.localStorage['token'])
    if (token) {
     return this.normalize(token)
    }
  }

  static normalize (token) {
    return {
      expiresIn: token['expires_in'],
      accessToken: token['access_token'],
      refreshToken: token['refresh_token']
    }
  }
}
