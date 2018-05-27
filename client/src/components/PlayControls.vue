<template lang="pug">
  v-footer.px-4.elevation-4.play-controls(height='80', app, fixed)
    v-layout(align-center, wrap)
      v-flex(sm3, xs12)
        .body-2 Artist Name
        .body-1 Track Name
      v-flex.text-xs-center(sm6, xs12)
        v-layout(row, wrap, align-center)
          v-spacer
          v-btn.my-0(icon)
            v-icon(size='14') shuffle
          v-btn.my-0(icon)
            v-icon(size='28') skip_previous
          v-btn.my-0(icon, outline)
            v-icon(size='28') play_arrow
          v-btn.my-0(icon)
            v-icon(size='28') skip_next
          v-btn.my-0(icon)
            v-icon(size='14') repeat
          v-spacer
        v-layout(row, align-center)
          .caption 00:00
          v-slider.pa-0.mx-3(color='black', thumb-color='black', v-model='position')
          .caption 00:00
      v-flex.text-xs-right(sm3, xs12  )
        v-layout(row, align-center)
          v-spacer
          v-menu(v-model='showDevices', top, offset-y, fixed, full-width)
            v-btn(icon, slot='activator')
              v-icon speaker
            devices
          v-slider.pa-0(color='black', thumb-color='black', v-model='volume')
</template>

<script>
  import Devices from './Devices'
  export default {
    components: {Devices},
    data () {
      return {
        position: 0,
        volume: 0,
        showDevices: false
      }
    }
  }
</script>

<style>
  .play-controls .input-group--slider,
  .play-controls .slider {
    height: 24px !important;
  }
</style>
