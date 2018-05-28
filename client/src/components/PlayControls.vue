<template lang="pug">
  v-footer.px-3.elevation-4.play-controls(height='80', fixed)
    v-layout(align-center, wrap)
      v-flex(sm3, xs12)
        .vertical-center-container
          .vertical-center
            .artwork.elevation-5
              img(:src='playerState.images[0].url')
          .vertical-center.pl-3
            .body-2.truncate(v-text='playerState.artist')
            .body-1.truncate(v-text='playerState.track')
      v-flex.text-xs-center(sm6, xs12)
        v-layout(row, wrap, align-center)
          v-spacer
          v-btn.my-0(icon)
            v-icon(size='14') shuffle
          v-btn.my-0(icon, @click='previousTrack')
            v-icon(size='28') skip_previous
          v-btn.my-0(icon, outline, @click='togglePlay')
            v-icon(size='28') {{ playerState.paused ? 'play_arrow' : 'pause' }}
          v-btn.my-0(icon, @click='nextTrack')
            v-icon(size='28') skip_next
          v-btn.my-0(icon)
            v-icon(size='14') repeat
          v-spacer
        v-layout(row, align-center)
          .caption(v-text='playerState.elapsed')
          v-slider.pa-0.mx-3(color='black', thumb-color='black', v-model='playerState.position', @click='seek')
          .caption(v-text='playerState.duration')
      v-flex.text-xs-right(sm3, xs12)
        v-layout(row, align-center)
          v-spacer
          v-menu(v-model='showDevices', top, left, offset-y, fixed)
            v-btn(icon, slot='activator')
              v-icon speaker
            devices
          v-slider.pa-0(color='black', thumb-color='black', v-model='playerState.volume', @click='setVolume')
</template>

<script>
  import Devices from './Devices'

  export default {
    components: {Devices},
    props: ['player', 'playerState'],
    data () {
      return {
        showDevices: false
      }
    },
    methods: {
      setVolume () {
        this.player.setVolume(this.playerState.volume / 100).then(() => {
          console.log('Set the volume to ' + this.playerState.volume)
        })
      },
      seek () {
        const positionMs = this.playerState.durationMs * (this.playerState.position / 100)
        this.player.seek(positionMs).then(() => {
          console.log('Seeked to ' + positionMs)
        })
      },
      nextTrack () {
        this.player.nextTrack().then(() => {
          console.log('Skipped to next track!')
        })
      },
      previousTrack () {
        this.player.previousTrack().then(() => {
          console.log('Skipped to previous track!')
        })
      },
      togglePlay () {
        this.player.togglePlay().then(() => {
          console.log('Toggled playback!')
        })
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

<style scoped>
  .artwork {
    width: 58px;
    height: 58px;
  }
  .artwork img {
    width: 100%;
  }
</style>
