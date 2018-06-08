<template lang="pug">
  v-footer.elevation-4.play-controls(:height='$vuetify.breakpoint.smAndUp ? 80 : showPlayer ? 450 : 44', fixed, app)
    v-layout(align-center, wrap)
      v-flex.hidden-sm-and-up(xs12)
        v-layout(align-center)
          v-btn(icon, small, @click='showPlayer = !showPlayer')
            v-icon {{ showPlayer ? 'expand_more' : 'expand_less' }}
          v-flex.text-xs-center(v-show='!showPlayer')
                .body-2.truncate.compress(v-text='playerState.artist')
                .body-1.truncate.compress(v-text='playerState.track')
          v-btn(icon, small, outline, @click='togglePlay', v-show='!showPlayer')
            v-icon {{ playerState.paused ? 'play_arrow' : 'pause' }}
      v-flex.px-3(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout
          .vertical-center-container.mx-xs-auto(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
            .vertical-center.mb-xs-3(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
              .artwork.elevation-5.mx-auto(:class='{"mobile-large": $vuetify.breakpoint.xsOnly, "desktop": $vuetify.breakpoint.smAndUp}')
                img(:src='playerState.images[0].url')
            .vertical-center.text-xs-center.text-sm-left.pl-3.pa-xs-0.mb-xs-3(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
              .body-2.truncate.compress(v-text='playerState.artist')
              .body-1.truncate.compress(v-text='playerState.track')
      v-flex.text-xs-center(sm6, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout.mb-xs-3(row, align-center)
          v-spacer
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18') shuffle
          v-btn.my-0(icon, @click='previousTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 46', :large='$vuetify.breakpoint.xsOnly') skip_previous
          v-btn.my-0(icon, outline, @click='togglePlay', :large='$vuetify.breakpoint.xsOnly')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 26 : 32') {{ playerState.paused ? 'play_arrow' : 'pause' }}
          v-btn.my-0(icon, @click='nextTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 46', :large='$vuetify.breakpoint.xsOnly') skip_next
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18') repeat
          v-spacer
        v-layout.mx-xs-5(row, align-center)
          .caption(v-text='playerState.elapsed')
          v-slider.pa-0.mx-3(:color='isDarkTheme ? "white" : "black"', :thumb-color='isDarkTheme ? "white" : "black"', v-model='playerState.position', @click='seek')
          .caption(v-text='playerState.duration')
      v-flex.px-3.text-xs-right(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout(row, align-center)
          v-spacer
          v-menu(v-model='showDevices', top, left, offset-y, fixed)
            v-btn(icon, slot='activator')
              v-icon speaker
            devices(:is-spotify-connected='isSpotifyConnected')
          v-slider.pa-0.hidden-xs-only(:color='isDarkTheme ? "white" : "black"', :thumb-color='isDarkTheme ? "white" : "black"', v-model='playerState.volume', @click='setVolume')
          v-spacer.hidden-sm-and-up
</template>

<script>
  import Devices from './Devices'
  import PlayerService from '../services/PlayerService'

  export default {
    components: {Devices},
    props: {
      player: Object,
      playerState: Object,
      isDarkTheme: Boolean,
      isSpotifyConnected: Function
    },
    data () {
      return {
        showPlayer: false,
        showDevices: false
      }
    },
    methods: {
      setVolume () {
        if (this.player) {
          this.player.setVolume(this.playerState.volume / 100)
        }
        // Available in spotify-web-api-node v3.1.1, which is currently broken
        // PlayerService.setVolume(Number(this.playerState.volume || 0))
      },
      seek () {
        if (this.player) {
          const positionMs = Math.floor(this.playerState.durationMs * (this.playerState.position / 100))
          this.player.seek(positionMs)
        }
        // Available in spotify-web-api-node v3.1.1, which is currently broken
        // PlayerService.seek(positionMs)
      },
      nextTrack () {
        PlayerService.next()
      },
      previousTrack () {
        PlayerService.previous()
      },
      togglePlay () {
        if (this.playerState.paused) {
          PlayerService.play()
        } else {
          PlayerService.pause()
        }
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
  .compress {
    line-height: 1.1;
  }

  .artwork.desktop {
    width: 58px;
    height: 58px;
  }

  .artwork.mobile-large {
    width: 200px;
    height: 200px;
  }
  .artwork.mobile-small {
    max-width: 32px;
    max-height: 32px;
  }
  .artwork img {
    width: 100%;
  }
</style>
