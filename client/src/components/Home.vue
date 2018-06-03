<template lang="pug">
  .callback
    v-layout(row, wrap)
      v-flex.my-1.pa-2(v-for='(playlist, index) in playlists', :key='index')
        router-link(:to='{name: "playlist", params: {id: playlist.id}}')
          .playlist-artwork.elevation-5.mb-2.mx-auto(v-ripple='{ class: "white--text" }')
            img(v-if='playlist.images[0]', :src='playlist.images[0].url')
            .no-image.grey.darken-3.subheading(v-else) No image found
        .playlist-name.body-2.text-xs-center.mx-auto {{ playlist.name }}
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'callback',
    props: ['setShowBackButton'],
    data () {
      return {
        playlists: {}
      }
    },
    async created () {
      // TODO consider caching images
      this.playlists = await SpotifyService.getPlaylists()
      this.setShowBackButton(false)
    }
  }
</script>

<style scoped>
  .playlist-artwork img,
  .playlist-artwork {
    width: 200px;
    height: 200px;
    display: block;
  }

  .playlist-name {
    width: 200px;
    overflow-wrap: break-word;

  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  li {
    list-style-type: none;
    margin: 10px;

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
