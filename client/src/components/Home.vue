<template lang="pug">
  .callback
    h1 Your Playlists
    ul(v-if="results")
      li(v-for="item in results.results", v-on:click="goToPlaylist(item)")
        v-container
          v-layout(row, wrap)
            v-flex(xl2, lg3, md4, sm6, xs12)
              img(v-if="item.images[0]", :src="item.images[0].url")
              .no-image(v-else) No image found
              .name {{ item.name }}


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
      }
    }
  }
</script>

<style scoped>
  img {
    width: 240px;
    height: 240px;
    display: block;
  }

  .name {
    text-align: center;
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
    background-color: #c0ffee;
    line-height:240px;
    vertical-align: middle;
    text-align: center;
  }

  .emoji-text {
    margin-top: -50px;
  }
</style>
