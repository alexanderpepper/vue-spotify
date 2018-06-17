'use strict'
module.exports = async function (app) {
  const AppUser = app.models.AppUser
  const AppRole = app.models.AppRole
  const AppRoleMapping = app.models.AppRoleMapping

  AppRoleMapping.belongsTo(AppUser)
  AppUser.hasMany(AppRoleMapping, {as: 'roleMappings', foreignKey: 'principalId'})
  AppRole.hasMany(AppUser, {as: 'users', through: AppRoleMapping, foreignKey: 'roleId'})

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
      AppRole.create({
        name: 'admin'
      }, function (err, role) {
        if (err) return console.log(err)
        console.log(role)

        role.principals.create({
          principalType: AppRoleMapping.USER,
          principalId: users[0].id
        }, function (err, principal) {
          if (err) return console.log(err)
          console.log(principal)
        })
      })
    })
  }
}
