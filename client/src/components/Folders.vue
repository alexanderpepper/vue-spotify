<template lang="pug">
  v-layout.folders.primary
    v-list.full-width
      draggable(v-model='app.playlists')
        v-list-tile(v-for='(playlist, index) in app.playlists', :key='index')
          v-list-tile-content
            v-list-tile-title {{ playlist.name }}
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'folders',
    props: {app: Object},
    components: {draggable}
  }
</script>
