import BaseService from './BaseService'
import api from '../constants/api.js'

class TokenService extends BaseService {
  static getAuthorizationUrl () {
    return this.GET(api.getAuthorizationUrl).then(results => results.url)
  }

  static setAuthorizationCode (code) {
    return this.POST(api.setAuthorizationCode, {code})
  }
}

export default TokenService
