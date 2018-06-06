<template lang="pug">
  modal-spinner
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  import UserService from '../services/UserService'
  import ModalSpinner from './ModalSpinner'

  export default {
    name: 'callback',
    components: {ModalSpinner},
    props: ['setUser'],
    async mounted () {
      await SpotifyService.setAuthorizationCode(this.$route.query.code)
      this.setUser(await UserService.me())
      this.$router.push({name: 'playlists'})
    }
  }
</script>
