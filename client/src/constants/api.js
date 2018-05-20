const host = process.env.API_URL

export default {
  login: `${host}/AppUsers/login`,
  logout: `${host}/AppUsers/logout`,
  users: `${host}/AppUsers`,
  password: `${host}/AppUsers/change-password`,
  roles: `${host}/Roles`,
  me: (id) => `${host}/AppUsers/${id}`,
  roleMappings: `${host}/RoleMappings`,
  roleMapping: (id) => `${host}/RoleMappings/${id}`,
  usersPaginated: `${host}/AppUsers/paginated`,
  userCount: `${host}/AppUsers/count`,
  uploadFile: `${host}/Containers/things/upload`,
  user: (id) => `${host}/AppUsers/${id}`,
  authorizationUrl: `${host}/Hooks/authorization-url`,
  setAuthorizationCode: `${host}/Hooks/set-authorization-code`,
  playlists: `${host}/Hooks/playlists`,
  playlist: (id) => `${host}/Hooks/playlist/${id}`,
  transferPlayback: (id, play) => `${host}/Hooks/transferPlayback/${id}/${play}`,
  play: (spotifyURI) => `${host}/Hooks/play/${spotifyURI}`,
  accessToken: `${host}/Hooks/access-token`,
  devices: `${host}/Hooks/devices`,
  currentSpotifyUser: `${host}/Hooks/me`
}
