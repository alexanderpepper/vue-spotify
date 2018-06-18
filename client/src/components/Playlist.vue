<template lang="pug">
  .playlist.pb-4.pa-xs-0
    v-layout.px-4.pt-4.mb-4(row, wrap, align-center)
      v-flex.text-xs-center(xs12, sm3)
        playlist-artwork.mb-xs-3(:playlist='playlist', elevation='10', size='100%')
      v-flex.px-4.text-sm-left.text-xs-center(xs12, sm9)
        .caption PLAYLIST
        .display-1.mb-2.bold {{ playlist.name }}
        .body-1.grey--text {{ tracks.length }} songs, {{ totalDuration }}
      v-flex.hidden-xs-only(md3, offset-md9, sm6, offset-sm6, xs12)
        v-text-field.filter-field.pt-0(v-model='search', placeholder='Filter', append-icon='search', hide-details)
    v-list.hidden-sm-and-up.py-0(two-line)
      v-list-tile(ripple, v-for='(track, index) in tracks', :key='index', @click='playSong(index)',)
        v-list-tile-content
          v-list-tile-title
            v-icon.playing-indicator.mr-1(v-if='isPlayingTrack(track)', size='17') volume_up
            span(:class='{"primary--text": isPlayingTrack(track)}') {{ track.title }}
          v-list-tile-sub-title(:class='{"primary--text": isPlayingTrack(track)}') {{ track.artist }} • {{ track.album }}
    v-data-table.px-4.hidden-xs-only(:headers='headers', :items='tracks', :loading='loading', :search='search', no-data-text='Loading playlist...', hide-actions, disable-initial-sort)
      template(slot='items', slot-scope='props')
        tr(@click='playSong(props.index)')
          td
            v-icon.data-table.playing-indicator.mr-1.primary--text(v-if='isPlayingTrack(props.item)', size='17') volume_up
            span(:class='{"primary--text": isPlayingTrack(props.item)}') {{ props.item.title }}
          td(:class='{"primary--text": isPlayingTrack(props.item)}') {{ props.item.artist }}
          td(:class='{"primary--text": isPlayingTrack(props.item)}') {{ props.item.album }}
          td.text-xs-right(:class='{"primary--text": isPlayingTrack(props.item)}') {{ props.item.duration }}
</template>

<script>
  import PlaylistService from '../services/PlaylistService'
  import PlayerService from '../services/PlayerService'
  import DateService from '../services/DateService'
  import PlaylistArtwork from './PlaylistArtwork'

  export default {
    name: 'playlist',
    props: {app: Object, id: String},
    components: {PlaylistArtwork},
    data () {
      return {
        headers: [
          {text: 'TITLE', value: 'title', align: 'left', sortable: false},
          {text: 'ARTIST', value: 'artist', align: 'left', sortable: false},
          {text: 'ALBUM', value: 'album', align: 'left', sortable: false},
          {text: 'TIME', value: 'duration', align: 'right', sortable: false}
        ],
        playlist: {images: []},
        tracks: [],
        totalDuration: 0,
        loading: true,
        search: '',
        audio: undefined
      }
    },
    async created () {
      this.playlist = await PlaylistService.getPlaylist(this.id)
      this.tracks = this.playlist.tracks.items.map(item => {
        return {
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map(a => a.name).join(', '),
          album: item.track.album.name,
          uri: item.track.uri,
          duration: DateService.formattedDuration(item.track.duration_ms),
          durationMs: item.track.duration_ms
        }
      })
      const totalMs = this.tracks.reduce((accumulator, current) => accumulator + Number(current.durationMs), 0)
      this.totalDuration = DateService.englishFormattedDuration(totalMs)
      this.loading = false
      this.audio = new Audio()
      this.app.showBackButton = true
    },
    methods: {
      async playSong (index) {
        PlayerService.play(this.tracks.map(t => t.uri), index)
      },
      isPlayingTrack (track) {
        return this.app.playerState.trackId === track.id
      }
    }
  }
</script>

<style>
  .playlist table.datatable.table,
  .playlist .list {
    background-color: transparent;
  }
</style>

<style scoped>
  .filter-field {
    margin-top: -32px;
  }

  .playing-indicator {
    margin-bottom: 2px;
  }

  .data-table.playing-indicator {
    margin-left: -22px;
  }

  img {
    width: 100%;
    max-width: 320px;
  }

  .no-image {
    width: 100%;
    height: 100%;
    line-height: 240px;
    vertical-align: middle;
    text-align: center;
  }
</style>
