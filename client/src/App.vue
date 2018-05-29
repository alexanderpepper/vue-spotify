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
      v-toolbar-title.mr-3
        .headline.cursor-pointer(@click='$router.push("/")') Home
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .title {{ user.spotifyUser && user.spotifyUser.display_name }}
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
      router-view.router-view.mx-auto( :show-snackbar='showSnackbar', :set-title='setTitle', :current-user='user', :set-active-menu-item='setActiveMenuItem', :login='login', :player='player')
    play-controls(:player='player', :player-state='playerState')
    v-snackbar( v-model='snackbar', :timeout='3000', :bottom='true', :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(dark, flat, @click='snackbar = false') Close
    v-dialog(v-model='showLogin', persistent, width='300')
      login(:create-account='createAccount', :login-success='loginSuccess', :show-snackbar='showSnackbar', :cancel='() => { showLogin = false }')
</template>

<script>
  import Login from './components/Login'
  import LoginService from './services/LoginService'
  import UserService from './services/UserService'
  import WebPlaybackService from './services/WebPlaybackService'
  import UserPhoto from './components/UserPhoto'
  import PlayControls from './components/PlayControls'
  import moment from 'moment'

  export default {
    components: {Login, UserPhoto, PlayControls},
    data () {
      return {
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
          track: 'Track Namezzzzzzzz',
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
      WebPlaybackService.getPlayer().then(player => {
        this.player = player
        setInterval(() => {
          this.player.getCurrentState().then(state => {
            this.playerState = {
              paused: state.paused,
              position: (state.position / state.duration) * 100,
              shuffle: state.shuffle,
              repeat: state.repeatMode === 0,
              track: state.track_window.current_track.name,
              artist: state.track_window.current_track.artists[0].name,
              images: state.track_window.current_track.album.images,
              elapsed: moment.utc(state.position).format(state.duration > 3600000 ? 'HH:mm:ss' : 'mm:ss'),
              duration: moment.utc(state.duration).format(state.duration > 3600000 ? 'HH:mm:ss' : 'mm:ss'),
              durationMs: state.duration,
              volume: this.playerState.volume
            }
          })
        }, 1000)
      })
    },
    created () {
      this.getUserInfo()
      this.isDarkTheme = window.localStorage['dark'] === 'true'
    },
    methods: {
      login () {
        this.showLogin = true
      },
      toggleTheme () {
        this.isDarkTheme = !this.isDarkTheme
        window.localStorage['dark'] = this.isDarkTheme
      },
      createAccount () {
        this.showLogin = false
        this.$router.push('/user')
      },
      loginSuccess (user) {
        console.log(user)
        this.setUser(user)
        this.showLogin = false
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
          UserService.me().then(this.setUser).catch(() => {
            console.log('Token expired.')
          })
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
  body {
    padding-bottom: 80px;
  }

  @media (max-width: 599px) {
    body {
      padding-bottom: 44px;
    }
  }

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
