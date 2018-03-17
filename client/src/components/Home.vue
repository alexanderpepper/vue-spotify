<template lang="pug">
  .callback
    h1 Home
    ul(v-if="results && results.results")
      li(v-for="item in results.results")
        img(v-if="item.images[0]", :src="item.images[0].url")
        div(v-else, class="no-image") No image found
        div(class="name") {{ item.name }}
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
