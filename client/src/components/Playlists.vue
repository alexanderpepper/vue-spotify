<template lang="pug">
  v-layout.playlists.pa-2(fill-height)
    v-layout(row, wrap, v-if='app && app.library && app.library.children')
      v-flex.my-1.pa-2(v-for='(item, index) in items', :key='index')
        router-link(:to='item.isLeaf ? {name: "playlist", params: {id: item.data.id}} : {name: "playlists", params: {folder: item}}')
          playlist-artwork(:library-playlist='item', :is-folder='!item.isLeaf', size='200px')
        .playlist-name.truncate.body-2.text-xs-center.mt-2.mx-auto {{ item.title }}
</template>

<script>
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlists',
    components: {PlaylistArtwork},
    props: {app: Object},
    computed: {
      items () {
        if (this.$route.query.path) {
          return this.folder().children
        } else {
          return this.app.library.children
        }
      }
    },
    methods: {
      folder () {
        return this.$route.query.path.split(',').reduce((node, index) => node.children[index], this.app.library)
      }
    }
  }
</script>

<style scoped>
  .playlist-name {
    width: 200px;
  }
</style>
