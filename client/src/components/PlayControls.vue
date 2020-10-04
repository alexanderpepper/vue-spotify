<template lang="pug">
  v-footer.elevation-4.play-controls(:height='$vuetify.breakpoint.smAndUp ? 80 : showPlayer ? 520 : 44', fixed, app)
    v-layout(align-center, wrap)
      v-flex.hidden-sm-and-up(xs12)
        v-layout(align-center)
          v-btn(icon, small, @click='showPlayer = !showPlayer')
            v-icon {{ showPlayer ? 'expand_more' : 'expand_less' }}
          v-flex.text-xs-center(v-show='!showPlayer')
                .body-2.truncate.compress(v-text='app.playerState.artist')
                .body-1.truncate.compress(v-text='app.playerState.track')
          v-btn(icon, small, outlined, @click='togglePlay', v-show='!showPlayer')
            v-icon {{ app.playerState.paused ? 'play_arrow' : 'pause' }}
      v-flex.px-3.hide-overflow-x(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout
          .vertical-center-container.mx-xs-auto(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
            .vertical-center.mx-xs-4(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
              .artwork.elevation-5.mx-auto(:class='{"mobile-large": $vuetify.breakpoint.xsOnly, "desktop": $vuetify.breakpoint.smAndUp}')
                img(:src='app.playerState.images[0].url')
            .vertical-center.text-xs-center.text-sm-left.pl-4.pa-xs-0.mx-xs-4(:class='{"d-block": $vuetify.breakpoint.xsOnly}')
              .body-2.truncate.compress(v-text='app.playerState.artist')
              .body-1.truncate.compress(v-text='app.playerState.track')
      v-flex.text-xs-center(sm6, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout.mx-xs-4(row, align-center)
          v-spacer
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp', @click='setShuffle')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18', :class='{"primary--text": app.playerState.shuffle}') shuffle
          v-btn.my-0(icon, @click='previousTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 46', :large='$vuetify.breakpoint.xsOnly') skip_previous
          v-btn.my-0(icon, outlined, @click='togglePlay', :large='$vuetify.breakpoint.xsOnly')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 26 : 32') {{ app.playerState.paused ? 'play_arrow' : 'pause' }}
          v-btn.my-0(icon, @click='nextTrack')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 28 : 46', :large='$vuetify.breakpoint.xsOnly') skip_next
          v-btn.my-0(icon, :small='$vuetify.breakpoint.smAndUp', @click='setRepeat')
            v-icon(:size='$vuetify.breakpoint.smAndUp ? 14 : 18', :class='{"primary--text": app.playerState.repeat !== repeatModes.off }') {{ app.playerState.repeat === repeatModes.track ? 'repeat_one' : 'repeat' }}
          v-spacer
        v-layout.mx-xs-8(row, align-center)
          .caption(v-text='app.playerState.elapsed')
          v-slider.pa-0.mx-3(:color='app.isDarkTheme ? "white" : "black"', :thumb-color='app.isDarkTheme ? "white" : "black"', v-model='app.playerState.position', @click='seek')
          .caption(v-text='app.playerState.duration')
      v-flex.px-3.text-xs-right(sm3, xs12, v-show='$vuetify.breakpoint.smAndUp || showPlayer')
        v-layout(row, align-center)
          v-spacer
          v-menu(v-model='showDevices', top, left, offset-y, fixed)
            template(v-slot:activator='{ on, attrs }')
              v-btn(icon v-bind='attrs' v-on='on')
                v-icon speaker
            devices(:app='app')
          v-slider.pa-0.hidden-xs-only(:color='app.isDarkTheme ? "white" : "black"', :thumb-color='app.isDarkTheme ? "white" : "black"', v-model='app.playerState.volume', @click='setVolume')
          v-spacer.hidden-sm-and-up
</template>

<script>
import Devices from './Devices'
import PlayerService from '../services/PlayerService'
import repeatModes from '../constants/repeat-modes'

export default {
  components: { Devices },
  props: { app: Object },
  data () {
    return {
      repeatModes,
      showPlayer: false,
      showDevices: false
    }
  },
  methods: {
    setShuffle () {
      PlayerService.setShuffle(!this.app.playerState.shuffle)
    },
    setRepeat () {
      const repeatModeKeys = Object.keys(repeatModes)
      const repeatModeIndex = (repeatModeKeys.indexOf(this.app.playerState.repeat) + 1) % 3
      PlayerService.setRepeat(repeatModeKeys[repeatModeIndex])
    },
    setVolume () {
      if (this.app.player) {
        this.app.player.setVolume(this.app.playerState.volume / 100)
      }
      // Available in spotify-web-api-node v3.1.1, which is currently broken
      // PlayerService.setVolume(Number(this.app.playerState.volume || 0))
    },
    seek () {
      if (this.app.player) {
        const positionMs = Math.floor(this.app.playerState.durationMs * (this.app.playerState.position / 100))
        this.app.player.seek(positionMs)
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
      if (this.app.playerState.paused) {
        PlayerService.play()
      } else {
        PlayerService.pause()
      }
    }
  }
}
</script>

<style>
  .play-controls .v-input-group--slider,
  .play-controls .v-slider {
    height: 24px !important;
    margin-bottom: -22px;
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
    width: 280px;
    height: 280px;
  }
  .artwork.mobile-small {
    max-width: 32px;
    max-height: 32px;
  }
  .artwork img {
    width: 100%;
  }
</style>
