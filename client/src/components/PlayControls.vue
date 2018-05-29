<template lang="pug">
  v-footer.px-3.elevation-4.play-controls(:height='$vuetify.breakpoint.smAndUp ? 80 : showPlayer ? 512 : 44', fixed)
    v-layout(align-center, wrap)
      v-flex(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        .vertical-center-container(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
          .vertical-center.mb-xs-3(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
            .artwork.elevation-5.mx-auto(:class='{"mobile-large": $vuetify.breakpoint.xsOnly, "desktop": $vuetify.breakpoint.smAndUp}')
              img(:src='playerState.images[0].url')
          .vertical-center.pl-3.text-xs-center.text-sm-left.mb-xs-3(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
            .body-2.truncate(v-text='playerState.artist')
            .body-1.truncate(v-text='playerState.track')
      v-flex.text-xs-center(sm6, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout.mb-xs-3(row, wrap, align-center)
          v-spacer
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18') shuffle
          v-btn.my-0(icon, @click='previousTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 48', :large='$vuetify.breakpoint.xsOnly') skip_previous
          v-btn.my-0(icon, outline, @click='togglePlay', :large='$vuetify.breakpoint.xsOnly')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 48') {{ playerState.paused ? 'play_arrow' : 'pause' }}
          v-btn.my-0(icon, @click='nextTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 48', :large='$vuetify.breakpoint.xsOnly') skip_next
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18') repeat
          v-spacer
        v-layout(row, align-center)
          .caption(v-text='playerState.elapsed')
          v-slider.pa-0.mx-3(color='black', thumb-color='black', v-model='playerState.position', @click='seek')
          .caption(v-text='playerState.duration')
      v-flex.text-xs-right(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout(row, align-center)
          v-spacer.hidden-xs-only
          v-menu(v-model='showDevices', top, left, offset-y, fixed)
            v-btn(icon, slot='activator')
              v-icon speaker
            devices
          v-slider.pa-0(color='black', thumb-color='black', v-model='playerState.volume', @click='setVolume')
      v-flex.hidden-sm-and-up.text-xs-center
        v-btn(flat, small, block, @click='showPlayer = !showPlayer') {{ showPlayer ? 'Hide' : 'Show' }} Player
</template>

<script>
  import Devices from './Devices'

  export default {
    components: {Devices},
    props: ['player', 'playerState'],
    data () {
      return {
        showPlayer: false,
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
  .artwork.desktop {
    width: 58px;
    height: 58px;
  }

  .artwork.mobile-large {
    width: 240px;
    height: 240px;
  }
  .artwork.mobile-small {
    max-width: 32px;
    max-height: 32px;
  }
  .artwork img {
    width: 100%;
  }

  @media (max-width: 599px) {
    .mb-xs-3 {
      margin-bottom: 16px;
    }
  }
</style>
