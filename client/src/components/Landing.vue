<template lang="pug">
  .landing.text-xs-center.pt-2
    .emoji {{ currentUser.id ? '💿' : '🦑' }}
    a(v-if='currentUser.id', :href='authorizationUrl') Login to Spotify
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  export default {
    name: 'Landing',
    props: ['currentUser'],
    data () {
      return {
        authorizationUrl: ''
      }
    },
    async created () {
      this.authorizationUrl = await SpotifyService.authorizationUrl()
    },
    watch: {
      currentUser: {
        handler () {
          if (this.currentUser && this.currentUser.spotifyUser) {
            this.$router.push({name: 'home'})
          }
        }
      }
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
