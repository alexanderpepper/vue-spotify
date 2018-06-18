<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    v-layout(row, wrap, v-if='app && app.playlists.length')
      v-flex.my-1.pa-2(v-for='(playlist, index) in app.playlists', :key='index')
        router-link(:to='{name: "playlist", params: {id: playlist.id}}')
          playlist-artwork(:playlist='playlist', size='200px')
        .playlist-name.truncate.body-2.text-xs-center.mt-2.mx-auto {{ playlist.name }}
</template>

<script>
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlists',
    components: {PlaylistArtwork},
    props: {app: Object}
  }
</script>

<style scoped>
  .playlist-name {
    width: 200px;
  }
</style>
