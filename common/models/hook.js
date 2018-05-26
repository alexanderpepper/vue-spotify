'use strict'

const SpotifyService = require('../../server/services/spotify-service')
const spotify = new SpotifyService()

module.exports = function (Hook) {

  Hook.authorizationUrl = function (cb) {
    cb(null, spotify.getAuthorizationUrl())
  }

  Hook.setAuthorizationCode = function (code, cb) {
    spotify.setAuthorizationCode(code).then(results => {
      console.log(results)
      cb(null, results)
    })
  }

  Hook.accessToken = function (cb) {
    cb(null, spotify.getAccessToken())
  }

  Hook.playlists = function (cb) {
    spotify.getPlaylists().then(results => {
      cb(null, results)
    })
  }

  Hook.devices = function (cb) {
    spotify.getDevices().then(results => {
      cb(null, results)
    }).catch(error => {
      console.log('Got error!', error);
    })
  }

  Hook.transferPlayback = function (deviceID, play, cb) {
    console.log("Trying to transfer playback to device", deviceID)
    spotify.transferPlayback(deviceID, play).then(results => {
      cb(null, results)
    }).catch(error => {
      console.log('caught error when trying to transfer playback.', error)
    });
  }

  Hook.play = function (spotifyURI, cb) {
    console.log("Trying to play", spotifyURI)
    spotify.play(spotifyURI).then(results => {
      cb(null, results)
    }).catch(error => {
      console.log('caught error when trying to play song', error)
    });
  }

  Hook.playlist = function (playlistID, cb) {
    console.log("Trying to get playlist ", playlistID)
    spotify.getPlaylist(playlistID).then(results => {
      cb(null, results)
    }).catch(error => {
      console.log('caught error when trying to get playlist', error)
    });
  }

  Hook.remoteMethod('authorizationUrl', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/authorization-url', verb: 'get'}
  })

  Hook.remoteMethod('accessToken', {
    returns: {arg: 'url', type: 'string'},
    http: {path: '/access-token', verb: 'get'}
  })

  Hook.remoteMethod('setAuthorizationCode', {
    accepts: [{arg: 'code', type: 'string'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/set-authorization-code', verb: 'post'}
  })

  Hook.remoteMethod('devices', {
    returns: {arg: 'results', type: 'object'},
    http: {path: '/devices', verb: 'get'}
  })

  Hook.remoteMethod('playlists', {
    returns: {arg: 'results', type: 'object'},
    http: {path: '/playlists', verb: 'get'}
  })

  Hook.remoteMethod('playlist', {
    accepts: [{arg: 'playlistID', type: 'string'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/playlist/:playlistID', verb: 'get'}
  })

  Hook.remoteMethod('transferPlayback', {
    accepts: [{arg: 'deviceID', type: 'string'}, {arg: 'play', type: 'boolean'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/transferPlayback/:deviceID/:play', verb: 'post'}
  })

  Hook.remoteMethod('play', {
    accepts: [{arg: 'spotifyURI', type: 'string'}],
    returns: {arg: 'results', type: 'object'},
    http: {path: '/play/:spotifyURI', verb: 'post'}
  })
}
