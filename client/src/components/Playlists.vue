<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    modal-spinner(v-if='!playlists.length')
    v-layout(row, wrap, v-if='playlists.length')
      v-flex.my-1.pa-2(v-for='(playlist, index) in playlists', :key='index')
        router-link(:to='{name: "playlist", params: {id: playlist.id}}')
          playlist-artwork(:playlist='playlist', size='200px')
        .playlist-name.truncate.body-2.text-xs-center.mt-2.mx-auto {{ playlist.name }}
</template>

<script>
  import PlaylistService from '../services/PlaylistService'
  import ModalSpinner from './ModalSpinner'
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlists',
    components: {ModalSpinner, PlaylistArtwork},
    props: {app: Object},
    data () {
      return {
        playlists: []
      }
    },
    async created () {
      this.playlists = await PlaylistService.getPlaylists()
      this.app.setShowBackButton(false)
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
