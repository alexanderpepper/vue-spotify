<template functional lang="pug">
  .user-photo-container.text-xs-center(row, align-center)
    v-icon(v-if='!props.app.isSpotifyConnected() || !props.app.user.spotifyUser.images.length', size='36') account_circle
    img.user-photo(:src='props.app.user.spotifyUser.images[0].url' v-if='props.app.isSpotifyConnected() && props.app.user.spotifyUser.images.length', :class='[props.size]', v-once)
</template>

<script>
  export default {
    name: 'userPhoto',
    props: {
      app: Object,
      size: String
    }
  }
</script>

<style scoped>
  .user-photo {
    border-radius: 50%;
    display: table-cell;
    vertical-align: middle;
  }

  .user-photo.large {
    max-width: 120px;
    max-height: 120px;
  }

  .user-photo.small {
    max-width: 21px;
    max-height: 21px;
    margin-left: 2px;
  }

  .user-photo.medium {
    max-width: 32px;
    max-height: 32px;
  }

  .user-photo-container {
    display: table;
  }
</style>
