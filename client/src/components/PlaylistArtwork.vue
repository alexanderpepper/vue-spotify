<template functional lang="pug">
  .playlist-artwork.mx-auto(v-ripple='{ class: "white--text" }', :class='[`elevation-${props.elevation || 5}`]', :style='{width: props.size, height: props.size}', v-once)
    img(v-if='props.artworkUrl', :src='props.artworkUrl')
    img(v-else, src='/static/transparent-square.png')
    .no-image.grey.darken-3.text-xs-center(v-if='!props.isFolder && !props.artworkUrl', :style='{width: props.size, height: props.size, "line-height": props.size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') queue_music
    .no-image.grey.darken-3.text-xs-center(v-if='props.isFolder', :style='{width: props.size, height: props.size, "line-height": props.size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') folder
</template>

<script>
  export default {
    name: 'playlistArtwork',
    props: {
      elevation: String,
      artworkUrl: String,
      isFolder: Boolean,
      size: String
    }
  }
</script>

<style scoped>
  .playlist-artwork img {
    width: 100%;
  }

  .playlist-artwork {
    position: relative;
    line-height: 0;
  }

  .no-image {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .no-image-icon-container {
    display: table;
    width: 100%;
    height: 100%;
  }

  .no-image-icon {
    display: table-cell;
    vertical-align: middle;
  }
</style>
