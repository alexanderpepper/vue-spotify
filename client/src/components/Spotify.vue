<template lang="pug">
  v-layout.home(fill-height)
    modal-spinner(v-if='!app.playlists.length')
    v-layout(v-if='app.playlists.length')
      v-flex.position-relative(xs12, sm4, md3, lg2)
        folders.overflow-scroll(:app='app')
      v-flex.position-relative(v-if='$vuetify.breakpoint.smAndUp', sm8, md9, lg10)
        router-view.overflow-scroll(:app='app')
    play-controls(:app='app')
</template>
<script>
  import Playlists from './Playlists'
  import Folders from './Folders'
  import ModalSpinner from './ModalSpinner'
  import FolderService from '../services/FolderService'
  import PlaylistService from '../services/PlaylistService'
  import PlayControls from './PlayControls'

  export default {
    name: 'home',
    props: {app: Object},
    components: {Playlists, Folders, ModalSpinner, PlayControls},
    async created () {
      const results = await Promise.all([
        PlaylistService.getPlaylists(),
        FolderService.get()
      ])
      this.app.playlists = results[0]
      this.app.folders = results[1]
      if (!this.app.folders.folders || !this.app.folders.folders.length) {
        this.app.folders = FolderService.fromPlaylists(this.app.playlists, this.app.user)
        FolderService.save(this.app.folders)
      }
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
