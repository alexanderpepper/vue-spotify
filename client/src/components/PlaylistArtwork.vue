<template lang="pug">
  .playlist-artwork.mx-auto(v-ripple='{ class: "white--text" }', :class='[`elevation-${elevation || 5}`]', :style='{width: size, height: size}')
    img(v-if='playlist.images[0]', :src='playlist.images[0].url')
    .no-image.grey.darken-3.subheading.text-xs-center(v-else, :style='{width: size, height: size, "line-height": size}')
      v-icon.grey--text.text--darken-1(size='100') queue_music
</template>

<script>
  export default {
    name: 'playlistArtwork',
    props: {
      elevation: String,
      playlist: Object,
      size: String
    }
  }
</script>

<style scoped>
  .playlist-artwork img {
    width: 100%;
  }
</style>
