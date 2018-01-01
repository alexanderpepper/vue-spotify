import BaseService from './BaseService'
import api from '../constants/api.js'

class LoginService extends BaseService {
  static login (credentials) {
    return this.POST(api.login, credentials, true).then(accessToken => {
      window.localStorage['token'] = accessToken.id
      window.localStorage['user'] = accessToken.userId
      return accessToken
    })
  }
  static logout () {
    return this.POST(api.logout, true).then(() => {
      delete window.localStorage['token']
      delete window.localStorage['user']
    })
  }
}

export default LoginService
