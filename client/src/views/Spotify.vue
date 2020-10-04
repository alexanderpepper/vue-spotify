<template lang="pug">
  .home.w-100.h-100
    .d-flex.h-100(v-if='app.library.children && !app.isLoadingShuffle')
      .h-100.position-relative.left-side(v-if='$vuetify.breakpoint.smAndUp || $route.name === "playlists"')
        library.overflow-scroll(:app='app')
      .h-100.position-relative.flex-grow-1(v-if='$vuetify.breakpoint.smAndUp || $route.name === "playlist"')
        router-view.overflow-scroll(:app='app')
    modal-spinner(v-else, :loading-text='app.loadingText')
    play-controls(:app='app')
</template>

<script>
import Playlists from './Playlists'
import Library from '../components/Library'
import ModalSpinner from '../components/ModalSpinner'
import LibraryService from '../services/LibraryService'
import PlayControls from '../components/PlayControls'

export default {
  name: 'home',
  props: { app: Object },
  components: { Playlists, Library, ModalSpinner, PlayControls },
  async created () {
    this.app.library = await LibraryService.get()
  }
}
</script>

<style scoped>
  .left-side {
    width: 200px;
  }
  @media screen and (max-width: 600px){
    .left-side {
      width: 100%;
    }
  }
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
    -webkit-overflow-scrolling: touch;
  }
</style>
