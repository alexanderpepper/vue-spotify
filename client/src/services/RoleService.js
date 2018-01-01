import BaseService from './BaseService'
import api from '../constants/api.js'

class RoleService extends BaseService {
  static all () {
    return this.GET(api.roles)
  }

  static roleMapping (user, role) {
    return this.GET(api.roleMappings, {
      filter: JSON.stringify({
        where: {
          and: [
            {principalId: user.id},
            {roleId: role.id}
          ]
        }
      })
    }).then(roleMappings => roleMappings[0])
  }

  static addRoleMapping (user, role) {
    return this.PUT(api.roleMappings, {
      principalType: 'USER',
      principalId: user.id,
      roleId: role.id
    })
  }

  static removeRoleMapping (roleMapping) {
    return this.DELETE(api.roleMapping(roleMapping.id))
  }
}

export default RoleService
