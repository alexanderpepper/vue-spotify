<template lang="pug">
  .playlist-artwork.mx-auto(v-ripple='{ class: "white--text" }', :class='[`elevation-${elevation || 5}`]', :style='{width: size, height: size}')
    img(v-if='artworkUrl', :src='artworkUrl')
    img(v-if='!artworkUrl', src='/static/transparent-square.png')
    .no-image.grey.darken-3.text-xs-center(v-if='!artworkUrl', :style='{width: size, height: size, "line-height": size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') queue_music
</template>

<script>
  import ImageCacheService from '../services/ImageCacheService'

  export default {
    name: 'playlistArtwork',
    props: {
      elevation: String,
      playlist: Object,
      size: String
    },
    data () {
      return {
        artworkUrl: false
      }
    },
    created () {
      const key = this.playlist && this.playlist.images && this.playlist.images.length && this.playlist.images[0].url

      if (key) {
        ImageCacheService.getObjectURL(key).then(objectURL => {
          if (objectURL) {
            // We were able to store stuff in the db, use the object URL
            console.log('Got objectURL from ImageCacheService:', objectURL)
            this.artworkUrl = objectURL
          } else {
            // in this case, it's better to use the existing URL and fall back on normal image loading
            console.log('Didn\'t get anything back from ImageCacheService')
            this.artworkUrl = key
          }
        })
      } else {
        console.log('The playlist we had didn\'t have an image.')
        this.artworkUrl = false
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
