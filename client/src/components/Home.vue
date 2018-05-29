<template lang="pug">
  .callback
    v-btn(flat, large, color='primary', @click='goToPickDevice()') Pick Device
    v-btn(flat, large, color='accent', @click='refreshAccessToken') Refresh Token
    ul(v-if='results')
      li(v-for='item in results.results', v-on:click='goToPlaylist(item)')
        v-container
          v-layout(row, wrap)
            v-flex.cursor-pointer(xl2, lg3, md4, sm6, xs12)
              .playlist-artwork.elevation-5.mb-2(v-ripple='{ class: "white--text" }')
                img(v-if='item.images[0]', :src='item.images[0].url')
                .no-image.grey.darken-3.subheading(v-else) No image found
              .playlist-name.body-2.text-xs-center {{ item.name }}
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'callback',
    data () {
      return {
        results: {}
      }
    },
    async mounted () {
      // TODO consider caching images
      this.results = await SpotifyService.getPlaylists()
    },
    methods: {
      goToPlaylist: function (playlist) {
        this.$router.push({name: 'playlist', params: {id: playlist.id}})
      },
      goToPickDevice () {
        this.$router.push({name: 'devices'})
      },
      async refreshAccessToken () {
        const response = await SpotifyService.refreshAccessToken()
        console.log(response)
      }
    }
  }
</script>

<style scoped>
  .playlist-artwork img,
  .playlist-artwork {
    width: 240px;
    height: 240px;
    display: block;
  }

  .playlist-name {
    width: 240px;
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
    width: 240px;
    height: 240px;
    line-height:240px;
    color: #fff;
    vertical-align: middle;
    text-align: center;
  }
</style>
