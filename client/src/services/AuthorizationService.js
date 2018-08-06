import BaseService from './BaseService'
import api from '../constants/api.js'

class AuthorizationService extends BaseService {
  static getAuthorizationUrl () {
    return this.GET(api.getAuthorizationUrl).then(results => results.url)
  }

  static setAuthorizationCode (code) {
    return this.POST(api.setAuthorizationCode, {code}).then(user => {
      window.localStorage['token'] = user.token.accessToken
      window.localStorage['user'] = user.id
      return user
    })
  }

  static getMe () {
    return this.GET(api.me)
  }

  static logout () {
    delete window.localStorage['token']
    delete window.localStorage['user']
  }

  static hasToken () {
    return window.localStorage['user'] && window.localStorage['token']
  }
}

export default AuthorizationService
