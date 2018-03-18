import BaseService from './BaseService'
import SpotifyService from './SpotifyService'

const play = ({
  spotifyURI,
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  }
}) => {
  getOAuthToken(accessToken => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotifyURI] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  })
}

let singletonPlayer

// TODO handle the case where this gets called twice in quick succession
// if the function is called again before the first one resolves, it could create two players.
function getPlayer () {
  // This promise lets us pretend to return in the 'ready' event.
  return new Promise(async resolve => {
    if (typeof singletonPlayer !== 'undefined') {
      console.log('Returning already-initialized player.')
      resolve(singletonPlayer)
      return
    }

    const token = await SpotifyService.getAccessToken()

    console.log('Token: ', token)

    const player = new window.Spotify.Player({
      name: 'Spotify .5 Web Player',
      getOAuthToken: cb => { cb(token.url) }
    })

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message) })
    player.addListener('authentication_error', ({ message }) => { console.error(message) })
    player.addListener('account_error', ({ message }) => { console.error(message) })
    player.addListener('playback_error', ({ message }) => { console.error(message) })

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state) })

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)

      singletonPlayer = player

      console.log('Returning newly-initialized player.')
      resolve(player)
    })

    // Connect to the player!
    player.connect()
  })
}

class WebPlaybackService extends BaseService {
  static async playSong (song) {
    const player = await getPlayer()

    play({
      playerInstance: player,
      spotifyURI: song.track.uri
    })
  }
}

export default WebPlaybackService
