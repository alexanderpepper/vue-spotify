<template lang="pug">
  .playlist-artwork.mx-auto(v-ripple='{ class: "white--text" }', :class='[`elevation-${elevation || 5}`]', :style='{width: size, height: size}')
    lazy-component(@show='init')
      img(v-if='artworkUrl', :src='artworkUrl')
    img(v-if='!artworkUrl', src='/static/transparent-square.png')
    .no-image.grey.darken-3.text-xs-center(v-if='!isFolder && !artworkUrl', :style='{width: size, height: size, "line-height": size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') queue_music
    .no-image.grey.darken-3.text-xs-center(v-if='isFolder', :style='{width: size, height: size, "line-height": size}')
      .no-image-icon-container
        v-icon.no-image-icon.grey--text.text--darken-1(size='100') folder
</template>

<script>
  import ImageCacheService from '../services/ImageCacheService'
  export default {
    name: 'playlistArtwork',
    props: {
      elevation: String,
      spotifyPlaylist: Object,
      libraryPlaylist: Object,
      size: String,
      isFolder: Boolean
    },
    data () {
      return {
        artworkUrl: false
      }
    },
    watch: {
      spotifyPlaylist: {
        handler () {
          this.init()
        }
      },
      libraryPlaylist: {
        handler () {
          this.init()
        }
      }
    },
    methods: {
      init () {
        const key = (this.libraryPlaylist && this.libraryPlaylist.data && this.libraryPlaylist.data.artworkUrl) ||
          (this.spotifyPlaylist && this.spotifyPlaylist.images && this.spotifyPlaylist.images.length && this.spotifyPlaylist.images[0].url)

        if (key) {
          ImageCacheService.getObjectURL(key).then(objectURL => {
            if (objectURL) {
              this.artworkUrl = objectURL
            } else {
              this.artworkUrl = key
            }
          })
        } else {
          this.artworkUrl = false
        }
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
