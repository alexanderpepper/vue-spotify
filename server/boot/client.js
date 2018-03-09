'use strict'
const exec = require('child_process').exec
module.exports = function (app) {
  if (!process.env.SKIP_CLIENT) {
    console.log('Building client...')
    exec(`npm run build`, {cwd: `${process.cwd()}/client`}, function (x, y) {
      console.log(x)
      console.log(y)
      console.log('Done building client')
    })
  }
}
