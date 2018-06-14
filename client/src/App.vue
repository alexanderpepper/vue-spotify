<template lang="pug">
  v-app(:dark='isDarkTheme', :light='!isDarkTheme')
    v-navigation-drawer(app, fixed, temporary, clipped, :mini-variant='miniVariant', v-model='drawer', v-show='user.isAdmin', :enable-resize-watcher='false', disable-route-watcher)
      v-list.py-0
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
      v-toolbar-side-icon.primary--text(@click.stop='drawer = !drawer', v-if='!showBackButton && user.isAdmin')
      v-btn(icon, v-if='showBackButton', @click='$router.go(-1)')
        v-icon.primary--text arrow_back
      v-toolbar-title.mr-3
        router-link.headline.cursor-pointer(:to='{name: "playlists"}') Spotify
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .subheading {{ userFullName }}
      v-btn(flat, v-show='!user.id', @click='showLogin = true') Sign Up / Sign In
      v-menu(offset-y, left, v-show='user.id')
        v-btn(icon, slot='activator')
          user-photo(size='medium', :user='user', :is-spotify-connected="isSpotifyConnected")
        v-list.py-0
          v-layout.px-3.pb-2.hidden-sm-and-up.pt-2(column)
            .caption Signed in as
            .body-2 {{ userFullName }}
          v-divider.hidden-sm-and-up
          v-list-tile(:to='{name: "user", params: {id: user.id, editProfile: true}}', ripple)
            v-list-tile-title Edit Profile
          v-list-tile(@click='showChangePassword = true', ripple)
            v-list-tile-title Change Password
          v-list-tile(@click='toggleTheme', :ripple='true')
            v-list-tile-title Switch Theme
          v-divider
          v-list-tile(@click='logout', ripple)
            v-list-tile-title Sign Out
    v-content
      router-view.router-view.mx-auto(:app='app')
    play-controls(v-if='isSpotifyConnected()', :app='app')
    v-snackbar(v-model='snackbar', :timeout='3000', :bottom='true', :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(dark, flat, @click='snackbar = false') Close
    v-dialog(v-model='showLogin', persistent, width='300')
      login(:app='app')
    v-dialog(v-model='showRegister', peristent, width='300')
      register(:app='app')
    v-dialog(v-model='showChangePassword', persistent, width='300')
      password(:app='app')
</template>

<script>
  import Password from './components/Password'
  import Login from './components/Login'
  import Register from './components/Register'
  import LoginService from './services/LoginService'
  import UserService from './services/UserService'
  import WebPlaybackService from './services/WebPlaybackService'
  import UserPhoto from './components/UserPhoto'
  import PlayControls from './components/PlayControls'
  import PlayerService from './services/PlayerService'
  import AuthorizationService from './services/AuthorizationService'

  export default {
    components: {Register, Login, UserPhoto, PlayControls, Password},
    data () {
      return {
        showBackButton: false,
        showRegister: false,
        showLogin: false,
        showChangePassword: false,
        isDarkTheme: true,
        drawer: false,
        items: [
          {icon: 'people', title: 'Manage Users', name: 'users'}
        ],
        miniVariant: false,
        user: {id: 0, spotifyUser: {}},
        snackbar: false,
        snackbarMessage: '',
        snackbarStyle: '',
        activeMenuItem: '',
        devices: [],
        player: null,
        playerState: PlayerService.initialPlayerState(),
        app: this
      }
    },
    watch: {
      $route: {
        handler () {
          this.showBackButton = false
        }
      },
      user: {
        handler () {
          if (!this.player && this.isSpotifyConnected()) {
            WebPlaybackService.getPlayer(this.user).then(player => {
              this.player = player
            })
          }
        }
      }
    },
    async created () {
      this.isDarkTheme = window.localStorage['dark'] !== 'false'
      await this.getUserInfo()
      setInterval(() => {
        if (this.isSpotifyConnected()) {
          PlayerService.getPlayerState().then(state => {
            this.playerState = PlayerService.parsePlayerState(this.playerState, state)
          })
          PlayerService.getDevices().then(devices => {
            this.devices = devices.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          })
        }
      }, 1000)
    },
    computed: {
      userFullName () {
        return this.isSpotifyConnected() ? this.user.spotifyUser.display_name : ''
      }
    },
    methods: {
      toggleTheme () {
        this.isDarkTheme = !this.isDarkTheme
        window.localStorage['dark'] = this.isDarkTheme
      },
      async loginSuccess () {
        const user = await UserService.me()
        this.setUser(user)
        this.showLogin = false
        this.showRegister = false
        if (!this.isSpotifyConnected()) {
          window.location.href = await AuthorizationService.getAuthorizationUrl()
        } else {
          this.$router.push({name: 'playlists'})
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
      },
      isSpotifyConnected () {
        return this.user && this.user.spotifyUser && this.user.spotifyUser.id
      }
    }
  }
</script>
