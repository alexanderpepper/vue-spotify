<template lang="pug">
  .callback
    
    section(v-if="playlistInfo && playlistInfo.name") 
      div(class="title-container")
        img(v-if="playlistInfo.images[0]", :src="playlistInfo.images[0].url")
        div(v-else, class="no-image") No image found
        h1 {{ playlistInfo.name }}
      table 
        tr
          th Title
          th Artist
          th Album
        tr(v-for="item in playlistInfo.tracks.items", v-on:click="playSong(item)") 
          td {{ item.track.name }}
          td {{ item.track.artists.map(a => a.name).join(", ") }}
          td {{ item.track.album.name }}

    h1(v-else) Loading Playlist...
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'callback',
    data () {
      return {
        playlistInfo: {},
        audio: undefined
      }
    },
    async mounted () {
      // TODO consider caching images
      console.log(this.$route.params)
      this.playlistInfo = await SpotifyService.getPlaylist(this.$route.params.playlist_id)
      this.playlistInfo = this.playlistInfo.results
      console.log(this.playlistInfo)
      this.audio = new Audio()
    },
    methods: {
      playSong: function (song) {
        console.log('Trying to play', song)
        this.audio.src = song.track.preview_url
        this.audio.play()
      }
    }
  }
</script>

<style scoped>
  img {
    width: 240px;
    height: 240px;
    display: inline;
  }

  h1 {
    margin-left: 20px; 
    font-size: 80px;
    line-height: 240px;
  }
 
  section {
    margin: 20px;
  }

  table {
    padding-top: 15px;
  }

  ol {
    margin: 20px;

  }

  li {
    margin: 10px;
  }

  th {
    text-align: left;
    border-bottom: 1px solid #bbb;
  } 

  th, td {
    padding: 10px;
  } 

  td {
    border-bottom: 1px solid #ddd;
  }

  .title-container {
    display: flex;
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
