<template lang="pug">
  .callback
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'callback',
    data () {
      return {
        results: {}
      }
    },
    mounted () {
      SpotifyService.setAuthorizationCode(this.$route.query.code)
      this.$router.push({name: 'home'})
    }
  }
</script>
