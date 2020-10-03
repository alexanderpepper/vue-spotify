<template lang="pug">
  v-app
    v-app-bar.app-toolbar(app, dense, fixed, clipped-left)
      v-btn.mx-0(icon, small, @click='$router.go(-1)')
        v-icon.primary--text(size='12') arrow_back_ios
      v-btn.mx-0(icon, small, @click='$router.go(1)')
        v-icon.primary--text(size='12') arrow_forward_ios
      v-toolbar-title.mr-4
        router-link.headline.cursor-pointer(:to='{name: "playlists"}') Spotify
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .subheading {{ userFullName }}
      v-menu(offset-y, left, v-show='user.id')
        template(v-slot:activator='{ on, attrs }')
          v-btn(icon v-bind='attrs' v-on='on')
            user-photo(size='medium', :app='app')
        v-list.py-0
          v-layout.px-3.pb-2.hidden-sm-and-up.pt-2(column)
            .caption Signed in as
            .body-2 {{ userFullName }}
          v-divider.hidden-sm-and-up
          v-list-tile(@click='toggleTheme', :ripple='true')
            v-list-tile-title Switch Theme
          v-divider
          v-list-tile(@click='logout', ripple)
            v-list-tile-title Sign Out
    v-main
      transition(name='fade-transition', mode='out-in')
        router-view.router-view.mx-auto(:app='app')
</template>

<script>
import WebPlaybackService from './services/WebPlaybackService'
import UserPhoto from './components/UserPhoto'
import PlayerService from './services/PlayerService'
import AuthorizationService from './services/AuthorizationService'

export default {
  components: { UserPhoto },
  data () {
    return {
      app: this,
      playlists: [],
      library: {},
      isDarkTheme: true,
      user: {},
      devices: [],
      player: null,
      playerState: PlayerService.initialPlayerState(),
      isLoadingShuffle: false,
      loadingText: 'Loading',
      stateRefreshInterval: null
    }
  },
  watch: {
    user: {
      handler () {
        if (!this.player && this.user.id) {
          WebPlaybackService.getPlayer(this.user).then(player => {
            this.player = player
          })
        }
      }
    }
  },
  async created () {
    this.isDarkTheme = window.localStorage.dark !== 'false'
    await this.getUserInfo()
    if (this.user.id) {
      this.$router.push({ name: 'playlists' })
      this.startStateRefresh()
    } else if (this.$route.name !== 'callback') {
      window.location.href = await AuthorizationService.getAuthorizationUrl()
    }
  },
  computed: {
    userFullName () {
      return this.user.id ? this.user.display_name : ''
    }
  },
  methods: {
    getUserInfo () {
      if (AuthorizationService.hasToken()) {
        return AuthorizationService.getMe().then(this.setUser).catch((err) => console.log(err))
      }
    },
    startStateRefresh () {
      setTimeout(() => {
        this.stateRefreshInterval = setInterval(() => {
          if (this.user.id) {
            PlayerService.getPlayerState().then(state => {
              if (state) {
                this.playerState = PlayerService.parsePlayerState(this.playerState, state)
              }
            })
            PlayerService.getDevices().then(devices => {
              if (devices) {
                this.devices = devices.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
              }
            })
          }
        }, 1000)
      }, 1000)
    },
    stopStateRefresh () {
      clearInterval(this.stateRefreshInterval)
    },
    selectDevice: function (deviceID) {
      PlayerService.transferPlayback(deviceID, true)
    },
    toggleTheme () {
      this.isDarkTheme = !this.isDarkTheme
      window.localStorage.dark = this.isDarkTheme
    },
    logout () {
      this.user = {}
      AuthorizationService.logout()
      this.$router.push('/')
    },
    setUser (user) {
      this.user = user
      this.$forceUpdate()
    }
  }
}
</script>
