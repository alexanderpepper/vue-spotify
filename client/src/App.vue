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
    v-toolbar.app-toolbar(app, fixed, clipped-left)
      v-toolbar-side-icon(@click.stop='drawer = !drawer', v-if='user.isAdmin')
      v-toolbar-title.mr-3
        .headline.cursor-pointer(@click='$router.push("/")') Home
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .subheader {{ user.name }}
      v-btn(flat, v-show='!user.id', @click='login') Sign Up / Sign In
      v-menu(offset-y, left, v-show='user.id')
        v-btn(icon, slot='activator')
          user-photo(size='medium', :user='user')
        v-list
          v-layout.px-3.pb-2.hidden-sm-and-up(column)
            .caption Signed in as
            .body-2 {{ user.name }}
            .caption.grey--text.toolbar-points {{ user.points | delimited }} Points
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
      router-view.router-view.mx-auto(
      :show-snackbar='showSnackbar',
      :set-title='setTitle',
      :current-user='user',
      :set-active-menu-item='setActiveMenuItem',
      :login='login')
    play-controls
    v-snackbar(
    v-model='snackbar',
    :timeout='3000',
    :bottom='true',
    :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(dark, flat, @click='snackbar = false') Close
    v-dialog(v-model='showLogin', persistent, width='300')
      login(
      :create-account='createAccount',
      :login-success='loginSuccess',
      :show-snackbar='showSnackbar',
      :cancel='() => { showLogin = false }')
</template>

<script>
  import Login from './components/Login'
  import LoginService from './services/LoginService'
  import UserService from './services/UserService'
  import WebPlaybackService from './services/WebPlaybackService'
  import UserPhoto from './components/UserPhoto'
  import PlayControls from './components/PlayControls'

  // I'm not 100% sold that this is the right place. It seems to be the first place with service imports available.
  WebPlaybackService.initializeWebPlaybackSDK()

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
        user: {id: 0},
        snackbar: false,
        snackbarMessage: '',
        snackbarStyle: '',
        activeMenuItem: ''
      }
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
        console.log(this.user)
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

  .greyed-out::after {
    content: '';
    position: absolute;
    background-color: rgba(255,255,255,.75);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

  .display-none {
    display: none;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .cursor-pointer {
    cursor: pointer !important;
  }

  .pointer-events-none {
    pointer-events: none;
  }

  .text-shadow {
    text-shadow: 1px 1px 2px black;
  }

  .tighten-line-height {
    line-height: 1.1 !important;
  }

  .app-toolbar .toolbar__content {
    max-width: 1280px;
    margin: 0 auto !important;
  }

  a {
    text-decoration: none;
  }

  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }
</style>

<style scoped>

  .router-view {
    max-width: 1280px;
  }

  .theme--dark .avatar-container {
    padding: 6px;
    background-color: white;
    border-radius: 50%;
  }

  img {
    width: 38px;
  }
</style>

