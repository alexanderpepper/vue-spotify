<template lang="pug">
  .callback.display-2.text-xs-center.mt-3 CALLBACK
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  import UserService from '../services/UserService'

  export default {
    name: 'callback',
    props: ['setUser'],
    async mounted () {
      await SpotifyService.setAuthorizationCode(this.$route.query.code)
      this.setUser(await UserService.me())
      this.$router.push({name: 'home'})
    }
  }
</script>
