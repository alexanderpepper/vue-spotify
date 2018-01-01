'use strict'

module.exports = function (AppUser) {
  AppUser.settings.acls.length = 0
  AppUser.settings.acls = require('./app-user-acl.json')

  AppUser.paginated = function (filter, cb) {
    const query = {
      where: {
        and: [
          { name: { like: filter.name, options: 'i' } },
          { email: { like: filter.email, options: 'i' } }
        ]
      },
      limit: filter.limit,
      skip: (filter.page - 1) * filter.limit,
      include: {
        relation: 'roleMappings',
        scope: {
          include: {
            relation: 'role'
          }
        }
      }
    }
    if (filter.role) {
      addRoleFilter().then(find)
    } else {
      find()
    }
    async function addRoleFilter () {
      const roleMappings = await AppUser.app.models.RoleMapping.find({ roleId: filter.role })
      const userIds = roleMappings.map(r => r.principalId)
      query.where.and.push({ id: { inq: userIds } })
    }
    async function find () {
      const results = await Promise.all([
        AppUser.find(query),
        AppUser.count(query.where)
      ])
      const users = results[0]
      const pageCount = Math.ceil(results[1] / query.limit)
      cb(null, { users, pageCount })
    }
  }

  AppUser.remoteMethod('paginated', {
    accepts: [{arg: 'filter', type: 'object'}],
    returns: {arg: 'results', type: 'object'}
  })
}
