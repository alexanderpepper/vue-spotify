<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    v-layout(row, wrap, v-if='app && app.playlists.length')
      v-flex.my-1.pa-2(v-for='(playlist, index) in playlists', :key='index')
        router-link(:to='{name: "playlist", params: {id: playlist.id}}')
          playlist-artwork(:playlist='playlist', size='200px')
        .playlist-name.truncate.body-2.text-xs-center.mt-2.mx-auto {{ playlist.name }}
</template>

<script>
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlists',
    components: {PlaylistArtwork},
    props: {app: Object, folder: Object},
    computed: {
      playlists () {
        if (this.folder) {
          if (this.folder.children) {
            return this.folder.children.map(child => this.app.playlists.find(playlist => playlist.id === child.data))
          } else {
            return []
          }
        } else {
          return this.app.playlists
        }
      }
    }
  }
</script>

<style scoped>
  .playlist-name {
    width: 200px;
  }
</style>
