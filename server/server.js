'use strict'

const loopback = require('loopback')
const express = require('express')
const boot = require('loopback-boot')
const https = require('https')
const http = require('http')
const sslConfig = require('./ssl-config')
const app = module.exports = loopback()
const isProd = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'
const protocol = isProd || isStaging ? 'https://' : 'http://'

app.start = function () {
  let server = null
  if (isProd || isStaging) {
    server = https.createServer({
      key: sslConfig.privateKey,
      cert: sslConfig.certificate,
      ca: sslConfig.chain
    }, app)
    const redirectServer = express()
    redirectServer.get('*', function (req, res) {
      res.redirect(`${protocol}${app.get('host')}${req.url}`)
    })
    redirectServer.listen(80)
  } else {
    server = http.createServer(app)
  }
  server.listen(app.get('port'), function () {
    var baseUrl = `${protocol}${app.get('host')}:${app.get('port')}`
    app.emit('started', baseUrl)
    console.log('LoopBack server listening at %s%s', baseUrl, '/')
    if (!isProd && app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
    }
  })
  return server
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err
  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start()
  }
})
