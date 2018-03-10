<template lang="pug">
  .landing.text-xs-center.pt-2
    .emoji 🦑
    a(:href='authorizationUrl') Login to Spotify
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  export default {
    name: 'Landing',
    data () {
      return {
        authorizationUrl: ''
      }
    },
    async created () {
      this.authorizationUrl = await SpotifyService.authorizationUrl()
      console.log(this.authorizationUrl)
    }
  }
</script>

<style scoped>
  .emoji {
    font-size: 126px;
  }

  .emoji-text {
    margin-top: -50px;
  }
</style>
