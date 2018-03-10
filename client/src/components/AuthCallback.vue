<template lang="pug">
  .callback
    div hey this is callback
    div {{ results }}
</template>

<script>
  import SpotifyService from "../services/SpotifyService";

  export default {
    name: 'callback',
    data () {
      return {
        results: {}
      }
    },
    async mounted () {
      this.results = await SpotifyService.setAuthorizationCode(this.$route.query.code)
    }
  }
</script>
