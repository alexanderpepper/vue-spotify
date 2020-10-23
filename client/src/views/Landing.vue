<template lang="pug">
  .landing.display-2.text-center.mt-4 LANDING
</template>

<script>
export default {
  name: 'landing',
  props: { app: Object },
  watch: {
    'app.user': {
      handler () {
        if (this.app.user.id) {
          this.$router.push({ name: 'playlists' })
        }
      }
    }
  }
}
</script>
