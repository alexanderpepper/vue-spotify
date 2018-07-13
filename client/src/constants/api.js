const host = process.env.API_URL

export default {
  login: `${host}/app-user/login`,
  logout: `${host}/app-user/logout`,
  users: `${host}/app-user`,
  password: `${host}/app-user/change-password`,
  roles: `${host}/app-role`,
  me: (id) => `${host}/app-user/${id}`,
  roleMappings: `${host}/app-role-mapping`,
  roleMapping: (id) => `${host}/app-role-mapping/${id}`,
  usersPaginated: `${host}/app-user/paginated`,
  user: (id) => `${host}/app-user/${id}`,
  getAuthorizationUrl: `${host}/authorization/url`,
  setAuthorizationCode: `${host}/authorization/code`,
  playlists: `${host}/playlist`,
  playlist: (id) => `${host}/playlist/${id}`,
  transferPlayback: (id, play) => `${host}/player/transfer/${id}/${play}`,
  shuffleFolder: `${host}/player/shuffle-folder`,
  play: `${host}/player/play`,
  pause: `${host}/player/pause`,
  next: `${host}/player/next`,
  previous: `${host}/player/previous`,
  devices: `${host}/player/devices`,
  playerState: `${host}/player/state`,
  setVolume: `${host}/player/volume`,
  setShuffle: `${host}/player/shuffle`,
  setRepeat: `${host}/player/repeat`,
  seek: `${host}/player/seek`,
  library: (id) => `${host}/library/${id || ''}`,
  myLibrary: `${host}/library/mine`

}
