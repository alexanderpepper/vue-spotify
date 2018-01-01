'use strict'
module.exports = async function (app) {
  const AppUser = app.models.AppUser
  const Role = app.models.Role
  const RoleMapping = app.models.RoleMapping

  RoleMapping.belongsTo(AppUser)
  AppUser.hasMany(RoleMapping, {foreignKey: 'principalId'})
  Role.hasMany(AppUser, {through: RoleMapping, foreignKey: 'roleId'})

  const user = await AppUser.findOne({where: {username: 'admin'}})
  if (!user) {
    console.log('Creating admin user');
    AppUser.create([
      {
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin1234',
        name: 'Administrator'
      }
    ], function (err, users) {
      if (err) {
        console.log(err)
        return
      }
      Role.create({
        name: 'admin'
      }, function (err, role) {
        if (err) return console.log(err)
        console.log(role)

        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function (err, principal) {
          if (err) return console.log(err)
          console.log(principal)
        })
      })
    })
  }
}
