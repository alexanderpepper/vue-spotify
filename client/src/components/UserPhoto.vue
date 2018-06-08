<template lang="pug">
  .user-photo-container.text-xs-center(row, align-center)
    v-icon(v-if='!userImage', size='36') account_circle
    img.user-photo(:src='userImage' v-if='userImage', :class='[size]')
</template>

<script>
  export default {
    name: 'userPhoto',
    props: {
      user: Object,
      size: String,
      isSpotifyConnected: Function
    },
    computed: {
      userImage () {
        if (this.isSpotifyConnected() && this.user.spotifyUser.images.length) {
          return this.user.spotifyUser.images[0].url
        }
      }
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
