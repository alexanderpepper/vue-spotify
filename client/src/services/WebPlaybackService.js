import BaseService from './BaseService'
import PlayerService from './PlayerService'

let singletonPlayer

class WebPlaybackService extends BaseService {
  // TODO handle the case where this gets called twice in quick succession
  // if the function is called again before the first one resolves, it could create two players.
  static getPlayer (user) {
    // giving it a name so we can recur
    const getPlayerWithRetries = retriesLeft => async resolve => {
      if (typeof singletonPlayer !== 'undefined') {
        resolve(singletonPlayer)
        return
      }

      if (!window.Spotify || !window.Spotify.Player) {
        if (retriesLeft < 1) {
          // TODO figure out how to fail
          return
        }

        setTimeout(() => getPlayerWithRetries(retriesLeft - 1)(resolve), 1000)
        return
      }

      const player = new window.Spotify.Player({
        name: 'VueSpotify Player',
        getOAuthToken: cb => { cb(user.token.accessToken) }
      })

      player.addListener('initialization_error', ({ message }) => { console.error(message) })
      player.addListener('authentication_error', ({ message }) => { console.error(message) })
      player.addListener('account_error', ({ message }) => { console.error(message) })
      player.addListener('playback_error', ({ message }) => { console.error(message) })
      // player.addListener('player_state_changed', state => { console.log(state) })

      player.addListener('ready', () => {
        singletonPlayer = player
        PlayerService.transferPlayback(player._options.id)
        resolve(player)
      })

      player.connect().then(success => {
        if (success) {
          console.log('Playback SDK connected to Spotify')
        }
      })
    }
    // This promise lets us pretend to return in the 'ready' event.
    return new Promise(getPlayerWithRetries(3))
  }
}

export default WebPlaybackService
