<template lang="pug">
  v-app(:dark='isDarkTheme', :light='!isDarkTheme')
    v-navigation-drawer(app, fixed, temporary, clipped, :mini-variant='miniVariant', v-model='drawer', v-show='user.isAdmin', :enable-resize-watcher='false', disable-route-watcher)
      v-list
        v-list-tile(@click.stop='miniVariant = !miniVariant', ripple)
          v-list-tile-action
            v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
          v-list-tile-content
            v-list-tile-title ADMINISTRATOR MENU
        v-list-tile(value='true', v-for='(item, i) in items', :key='i',  @click='menuItemClicked(item)', ripple)
          v-list-tile-action
            v-icon(v-html='item.icon', :class='{ "grey--text": !isActiveMenuItem(item), "text--darken-2": !isActiveMenuItem(item) }')
          v-list-tile-content
            v-list-tile-title(v-text='item.title', :class='{"grey--text": !isActiveMenuItem(item), "text--darken-1": !isActiveMenuItem(item) }')
    v-toolbar.app-toolbar(app, dense, fixed, clipped-left)
      v-toolbar-side-icon(@click.stop='drawer = !drawer', v-if='user.isAdmin')
      v-btn(icon, v-if='showBackButton', @click='$router.go(-1)')
        v-icon arrow_back
      v-toolbar-title.mr-3
        .headline.cursor-pointer(@click='$router.push("/")') Spotify
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .subheading {{ user.spotifyUser && user.spotifyUser.display_name }}
      v-btn(flat, v-show='!user.id', @click='login') Sign Up / Sign In
      v-menu(offset-y, left, v-show='user.id')
        v-btn(icon, slot='activator')
          user-photo(size='medium', :user='user')
        v-list
          v-layout.px-3.pb-2.hidden-sm-and-up(column)
            .caption Signed in as
            .body-2 {{ user.spotifyUser && user.spotifyUser.display_name }}
          v-divider.hidden-sm-and-up
          v-list-tile(@click='$router.push({ name: "user", params: { id: user.id, editProfile: true } })', ripple)
            v-list-tile-title Edit Profile
          v-list-tile(@click='$router.push({ name: "password" })', ripple)
            v-list-tile-title Change Password
          v-list-tile(@click='toggleTheme', :ripple='true')
            v-list-tile-title Switch Theme
          v-divider
          v-list-tile(@click='logout', ripple)
            v-list-tile-title Sign Out
    v-content
      router-view.router-view.mx-auto(:set-show-back-button='setShowBackButton', :is-dark-theme='isDarkTheme', :show-snackbar='showSnackbar', :set-title='setTitle', :current-user='user', :set-user='setUser', :set-active-menu-item='setActiveMenuItem', :login='login', :player='player')
    play-controls(:is-dark-theme='isDarkTheme', :player='player', :player-state='playerState', :current-user='user', v-if='user && user.spotifyUser && user.spotifyUser.id')
    v-snackbar(v-model='snackbar', :timeout='3000', :bottom='true', :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(dark, flat, @click='snackbar = false') Close
    v-dialog(v-model='showLogin', persistent, width='300')
      login(:login-success='loginSuccess', :show-snackbar='showSnackbar', :cancel='() => { showLogin = false }', :register='register')
    v-dialog(v-model='showRegister', peristent, width='300')
      register(:login='login', :show-snackbar='showSnackbar', :login-success='loginSuccess', :cancel='() => { showRegister = false }')
</template>

<script>
  import Login from './components/Login'
  import Register from './components/Register'
  import LoginService from './services/LoginService'
  import UserService from './services/UserService'
  import WebPlaybackService from './services/WebPlaybackService'
  import UserPhoto from './components/UserPhoto'
  import PlayControls from './components/PlayControls'
  import DateService from './services/DateService'
  import SpotifyService from './services/SpotifyService'

  export default {
    components: {Register, Login, UserPhoto, PlayControls},
    data () {
      return {
        showBackButton: false,
        showRegister: false,
        showLogin: false,
        isDarkTheme: true,
        drawer: false,
        items: [
          {icon: 'people', title: 'Manage Users', name: 'users'}
        ],
        miniVariant: false,
        title: 'Crowd Source',
        user: {id: 0, spotifyUser: {}},
        snackbar: false,
        snackbarMessage: '',
        snackbarStyle: '',
        activeMenuItem: '',
        player: null,
        playerState: {
          paused: true,
          repeat: false,
          shuffle: false,
          position: 0,
          track: 'Track Name',
          artist: 'Artist Name',
          images: [{}],
          elapsed: '00:00',
          duration: '00:00',
          durationMs: 0,
          volume: 50
        }
      }
    },
    beforeCreate () {
      setInterval(() => {
        if (this.user && this.user.spotifyUser && this.user.spotifyUser.id) {
          if (!this.player) {
            WebPlaybackService.getPlayer().then(player => {
              this.player = player
            })
          }
          SpotifyService.getPlayerState().then(state => {
            if (state) {
              this.playerState = {
                ...this.playerState,
                paused: !state.is_playing,
                shuffle: state.shuffle_state,
                repeat: state.repeat_state !== 'off'
              }

              if (state.item) {
                this.playerState = {
                  ...this.playerState,
                  position: (state.progress_ms / state.item.duration_ms) * 100,
                  track: state.item.name,
                  artist: state.item.artists[0].name,
                  images: state.item.album.images,
                  elapsed: DateService.formattedDuration(state.progress_ms),
                  duration: DateService.formattedDuration(state.item.duration_ms),
                  durationMs: state.item.duration_ms
                }
              }

              if (state.device) {
                this.playerState = {
                  ...this.playerState,
                  volume: state.device.volume,
                  device: state.device.name
                }
              }
            }
          })
        }
      }, 1000)
    },
    created () {
      this.getUserInfo().then(() => {
        if (this.user && this.user.id && (!this.user.spotifyUser || !this.user.spotifyUser.id)) {
          SpotifyService.authorizationUrl(url => {
            window.location.href = url
          })
        }
      })
      this.isDarkTheme = window.localStorage['dark'] === 'true'
    },
    methods: {
      setShowBackButton (showBackButton) {
        this.showBackButton = showBackButton
      },
      login () {
        this.showRegister = false
        this.showLogin = true
      },
      register () {
        this.showRegister = true
        this.showLogin = false
      },
      toggleTheme () {
        this.isDarkTheme = !this.isDarkTheme
        window.localStorage['dark'] = this.isDarkTheme
      },
      async loginSuccess () {
        const user = await UserService.me()
        this.setUser(user)
        this.showLogin = false
        this.showRegister = false
        if (!user.spotifyUser || !user.spotifyUser.id) {
          window.location.href = await SpotifyService.authorizationUrl()
        } else {
          this.$router.push({name: 'home'})
        }
      },
      async logout () {
        try {
          await LoginService.logout()
        } finally {
          this.user = {}
          this.$router.push('/')
        }
      },
      getUserInfo () {
        if (UserService.hasToken()) {
          return UserService.me().then(this.setUser).catch(() => console.log('Token expired.'))
        }
      },
      showSnackbar (message, style) {
        this.snackbarMessage = message
        this.snackbarStyle = style
        this.snackbar = true
      },
      setTitle (title) {
        this.title = title
        this.$forceUpdate()
      },
      setUser (user) {
        if (!user) return
        this.user = user
        this.user.isAdmin = user.roleMappings.find(r => r.role.name === 'admin') !== undefined
        this.$forceUpdate()
      },
      setActiveMenuItem (name) {
        this.activeMenuItem = name
        this.$forceUpdate()
        this.drawer = false
      },
      menuItemClicked (item) {
        this.$router.push({name: item.name})
        this.setActiveMenuItem(item.name)
      },
      isActiveMenuItem (item) {
        return this.activeMenuItem === item.name
      }
    }
  }
</script>

<style>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vertical-center {
    display: table-cell;
    vertical-align: middle;
  }

  .vertical-center-container {
    display: table;
  }

  .theme--light input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.87) !important;
  }

  .theme--dark input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #424242 inset !important;
    -webkit-text-fill-color: white !important;
  }

  textarea {
    resize: none;
  }

  .cursor-pointer {
    cursor: pointer !important;
  }

  a {
    text-decoration: none;
  }

  .display-none {
    display: none;
  }
</style>
