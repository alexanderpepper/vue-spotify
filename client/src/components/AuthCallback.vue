<template lang="pug">
  .callback
    div hey this is callback
    div {{ JSON.stringify(results, null, 4) }}
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
    async mounted () {
      await SpotifyService.setAuthorizationCode(this.$route.query.code)
      this.$router.push({name: 'home'})
    }
  }
</script>
