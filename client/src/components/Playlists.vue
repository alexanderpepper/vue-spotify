<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    v-layout(row, wrap, v-if='app && app.library && app.library.children')
      v-flex.my-1.pa-2(v-for='(item, index) in items', :key='index', draggable, v-on:dragstart='dragStart(item)')
        router-link(:to='item.isLeaf ? {name: "playlist", params: {id: item.data.id}} : {name: "playlists", params: {folder: item}}')
          playlist-artwork(:playlist='item', size='200px')
        .playlist-name.truncate.body-2.text-xs-center.mt-2.mx-auto {{ item.title }}
</template>

<script>
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlists',
    components: {PlaylistArtwork},
    props: {app: Object, folder: Object},
    computed: {
      items () {
        if (this.folder) {
          return this.folder.children
        } else {
          return this.app.library.children
        }
      }
    },
    methods: {
      dragStart (item) {
        this.app.draggingItem = item
      }
    }
  }
</script>

<style scoped>
  .playlist-name {
    width: 200px;
  }
</style>
