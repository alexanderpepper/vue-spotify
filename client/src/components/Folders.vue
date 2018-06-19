<template lang="pug">
  v-layout.folders.primary
    v-list.full-width
      v-list-tile(v-for='(playlist, index) in app.playlists', :key='index')
        v-list-tile-content
          v-list-tile-title {{ playlist.name }}
</template>

<script>

  export default {
    name: 'folders',
    props: {app: Object}
  }
</script>
