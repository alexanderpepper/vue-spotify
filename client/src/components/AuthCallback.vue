<template lang="pug">
  .callback
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'callback',
    async mounted () {
      await SpotifyService.setAuthorizationCode(this.$route.query.code)
      this.$router.push({name: 'home'})
    }
  }
</script>
