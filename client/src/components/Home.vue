<template lang="pug">
  v-layout.home(fill-height)
    modal-spinner(v-if='!app.playlists.length')
    v-layout(v-if='app.playlists.length', fill-height)
      v-flex.position-relative(xs12, sm4, md3, lg2)
        folders.overflow-scroll(:app='app')
      v-flex.position-relative(v-if='$vuetify.breakpoint.smAndUp', sm8, md9, lg10)
        playlists.overflow-scroll(:app='app')

</template>
<script>
  import Playlists from './Playlists'
  import Folders from './Folders'
  import ModalSpinner from './ModalSpinner'
  import PlaylistService from '../services/PlaylistService'

  export default {
    name: 'home',
    props: {app: Object},
    components: {Playlists, Folders, ModalSpinner},
    async created () {
      this.app.playlists = await PlaylistService.getPlaylists()
    }
  }
</script>

<style scoped>

  .position-relative {
    position: relative;
  }

  .overflow-scroll {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
  }
</style>
