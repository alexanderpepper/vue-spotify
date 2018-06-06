<template lang="pug">
  .landing.display-2.text-xs-center.mt-3 LANDING
</template>

<script>
  export default {
    name: 'landing',
    props: ['currentUser'],
    watch: {
      currentUser: {
        handler () {
          if (this.currentUser && this.currentUser.spotifyUser && this.currentUser.spotifyUser.id) {
            this.$router.push({name: 'playlists'})
          }
        }
      }
    }
  }
</script>
