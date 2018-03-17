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

async function getPlayer () {
  if (typeof singletonPlayer !== 'undefined') {
    console.log('Returning already-initialized player.')
    return singletonPlayer
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
  })

  // Connect to the player!
  player.connect()

  singletonPlayer = player

  console.log('Returning newly-initialized player.')
  return player
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
