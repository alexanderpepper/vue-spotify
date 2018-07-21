<template lang="pug">
  v-layout.playlists.pa-3(row, wrap, v-if='app && app.library && app.library.children')
    .px-3.pt-3(v-for='(item, index) in items', :key='index')
      router-link(:to='routeForItem(item, index)')
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
      },
      routeForItem (item, index) {
        return item.isLeaf
          ? {
            name: 'playlist',
            params: {id: item.data.id}
          }
          : {
            name: 'playlists',
            query: {path: (this.$route.query.path ? (this.$route.query.path + ',') : '') + index}
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
