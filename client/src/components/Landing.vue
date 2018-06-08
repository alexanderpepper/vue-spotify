<template lang="pug">
  .landing.display-2.text-xs-center.mt-3 LANDING
</template>

<script>
  export default {
    name: 'landing',
    props: ['isSpotifyConnected', 'user'],
    watch: {
      user: {
        handler () {
          if (this.isSpotifyConnected()) {
            this.$router.push({name: 'playlists'})
          }
        }
      }
    }
  }
</script>
