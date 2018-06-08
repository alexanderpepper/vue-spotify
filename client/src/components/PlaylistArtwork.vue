<template lang="pug">
  .playlist-artwork.elevation-5.mb-2.mx-auto(v-ripple='{ class: "white--text" }')
    img(v-if='playlist.images[0]', :src='playlist.images[0].url')
    .no-image.grey.darken-3.subheading(v-else)
      v-icon.grey--text.text--darken-1(size='100') queue_music
</template>

<script>
  export default {
    name: 'playlistArtwork',
    props: {
      playlist: Object
    }
  }
</script>

<style>
  .playlist-artwork img,
  .playlist-artwork {
    width: 200px;
    height: 200px;
    display: block;
  }

  .no-image {
    width: 200px;
    height: 200px;
    line-height:200px;
    color: #fff;
    vertical-align: middle;
    text-align: center;
  }
</style>
