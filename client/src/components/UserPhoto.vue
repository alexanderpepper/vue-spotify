<template lang="pug">
  .user-photo-container.text-xs-center(row, align-center)
    v-icon(v-if='!user.photo', :class='{"display-4": size === "large"}') account_circle
    img.user-photo(:src='user.photo' v-if='user.photo', :class='[size]')
</template>

<script>
  export default {
    name: 'userPhoto',
    props: {
      user: Object,
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
