<template lang="pug">
  v-layout.home(fill-height)
    v-layout(v-if='app.library.children')
      v-flex.position-relative(v-if='$vuetify.breakpoint.smAndUp || $route.name === "playlists"' xs12, sm4, md3, lg2)
        library.overflow-scroll(:app='app')
      v-flex.position-relative(v-if='$vuetify.breakpoint.smAndUp || $route.name === "playlist"', xs12, sm8, md9, lg10)
        router-view.overflow-scroll(:app='app')
    modal-spinner(v-else)
    play-controls(:app='app')
</template>
<script>
  import Playlists from './Playlists'
  import Library from './Library'
  import ModalSpinner from './ModalSpinner'
  import LibraryService from '../services/LibraryService'
  import PlayControls from './PlayControls'

  export default {
    name: 'home',
    props: {app: Object},
    components: {Playlists, Library, ModalSpinner, PlayControls},
    async created () {
      this.app.library = await LibraryService.get()
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
