<template lang="pug">
  .playlist-artwork.mx-auto(v-ripple='{ class: "white--text" }', :class='[`elevation-${elevation || 5}`]', :style='{width: size, height: size}')
    img(v-if='artwork', :src='artwork')
    img(v-else, src='/static/transparent-square.png')
    .no-image.grey.darken-3.text-xs-center(v-if='!isFolder && !artwork', :style='{width: size, height: size, "line-height": size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') queue_music
    .no-image.grey.darken-3.text-xs-center(v-if='isFolder', :style='{width: size, height: size, "line-height": size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') folder
</template>

<script>
  export default {
    name: 'playlistArtwork',
    props: {
      elevation: String,
      playlist: Object,
      size: String
    },
    computed: {
      isFolder () {
        return this.playlist && !this.playlist.isLeaf
      },
      artwork () {
        return this.playlist && this.playlist.data && this.playlist.data.artworkUrl
      }
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
