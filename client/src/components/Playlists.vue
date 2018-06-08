<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    modal-spinner(v-if='!playlists.length')
    v-layout(row, wrap, v-if='playlists.length')
      v-flex.my-1.pa-2(v-for='(playlist, index) in playlists', :key='index')
        router-link(:to='{name: "playlist", params: {id: playlist.id}}')
          playlist-artwork(:playlist='playlist')
        .playlist-name.body-2.text-xs-center.mx-auto.truncate {{ playlist.name }}
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  import ModalSpinner from './ModalSpinner'
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'callback',
    components: {ModalSpinner, PlaylistArtwork},
    props: ['setShowBackButton'],
    data () {
      return {
        playlists: []
      }
    },
    async created () {
      this.playlists = await SpotifyService.getPlaylists()
      this.setShowBackButton(false)
    }
  }
</script>

<style scoped>

  .playlist-name {
    width: 200px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  li {
    list-style-type: none;
    margin: 10px;

  }
</style>
