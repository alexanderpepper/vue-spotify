import BaseService from './BaseService'
import api from '../constants/api.js'

class UserService extends BaseService {
  static all () {
    return this.GET(api.users, {
      filter: JSON.stringify({
        include: {
          relation: 'roleMappings',
          scope: {
            include: {
              relation: 'role'
            }
          }
        }
      })
    })
  }

  static get (id) {
    return this.GET(api.user(id), {
      filter: JSON.stringify({
        include: {
          relation: 'roleMappings',
          scope: {
            include: {
              relation: 'role'
            }
          }
        }
      })
    })
  }

  static save (user) {
    if (user.id) {
      return this.PATCH(api.user(user.id), user)
    } else {
      return this.POST(api.users, user)
    }
  }

  static paginated (filter) {
    return this.POST(api.usersPaginated, { filter: filter })
      .then((data) => data.results)
  }

  static remove (user) {
    return this.DELETE(api.user(user.id))
  }

  static me () {
    const userId = window.localStorage['user']
    const token = window.localStorage['token']
    return this.GET(api.user(userId), {
      access_token: token,
      filter: JSON.stringify({
        include: [
          {
            relation: 'roleMappings',
            scope: {
              include: {
                relation: 'role'
              }
            }
          }
        ]
      })
    })
  }

  static changePassword (password) {
    return this.POST(api.password, password)
  }

  static hasToken () {
    return window.localStorage['user'] && window.localStorage['token']
  }
}

export default UserService
