<template lang="pug">
  .playlist.pb-6.pa-xs-0
    v-row.px-4.pt-6.mb-6(wrap, align-center)
      v-col.text-center(cols='12', sm='3')
        playlist-artwork.mx-xs-4(:spotify-playlist='playlist', elevation='10', size='100%')
      v-col.px-4.px-xs-0.text-sm-left.text-center(xs12, sm9)
        .caption PLAYLIST
        .display-1.mb-2.bold {{ playlistName }}
        .body-1.grey--text {{ tracks.length }} songs, {{ totalDuration }}
      v-col.hidden-xs-only(md='3', offset-md='9', sm='6', offset-sm='6', xs='12')
        v-text-field.filter-field.pt-0(v-model='search', placeholder='Filter', append-icon='search', hide-details)
    v-list.hidden-sm-and-up.py-0(two-line)
      v-list-item(ripple, v-for='(track, index) in tracks', :key='index', @click='playSong(index)',)
        v-list-item-content
          v-list-item-title
            v-icon.playing-indicator.mr-1(v-if='isPlayingTrack(track)', :class='{"primary--text": isPlayingTrack(track)}', size='17') volume_up
            span(:class='{"primary--text": isPlayingTrack(track)}') {{ track.title }}
          v-list-item-subtitle(:class='{"primary--text": isPlayingTrack(track)}') {{ track.artist }} • {{ track.album }}
    v-data-table.px-4.hidden-xs-only(:headers='headers', :items='tracks', :loading='loading', :search='search', no-data-text='Loading playlist...', hide-default-footer, sort-by='trackNumber')
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
import PlaylistArtwork from '../components/PlaylistArtwork'

export default {
  name: 'playlist',
  props: { app: Object, id: String },
  components: { PlaylistArtwork },
  data () {
    return {
      headers: [
        { text: 'TITLE', value: 'title', align: 'left', sortable: false },
        { text: 'ARTIST', value: 'artist', align: 'left', sortable: false },
        { text: 'ALBUM', value: 'album', align: 'left', sortable: false },
        { text: 'TIME', value: 'duration', align: 'right', sortable: false }
      ],
      playlist: undefined,
      playlistName: '',
      tracks: [],
      artworkUrl: '',
      totalDuration: 0,
      loading: true,
      search: '',
      audio: undefined
    }
  },
  watch: {
    id: {
      handler () {
        this.id && this.initialize()
      }
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      console.log('well ok')

      this.playlist = await PlaylistService.getPlaylist(this.id)
      this.tracks = this.playlist.tracks.items.map(item => {
        return {
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map(a => a.name).join(', '),
          album: item.track.album.name,
          uri: item.track.uri,
          duration: DateService.formattedDuration(item.track.duration_ms),
          durationMs: item.track.duration_ms,
          trackNumber: item.track.track_number
        }
      })
      const totalMs = this.tracks.reduce((accumulator, current) => accumulator + Number(current.durationMs), 0)
      this.totalDuration = DateService.englishFormattedDuration(totalMs)
      this.loading = false
      this.playlistName = this.playlist.name
      this.audio = new Audio()
      if (this.playlist && this.playlist.images && this.playlist.images.length) {
        this.artworkUrl = this.playlist.images[0].url
      }
    },
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
  .playlist table.v-datatable.v-table,
  .playlist .v-list {
    background-color: transparent;
  }
</style>

<style scoped>
  .filter-field {
    margin-top: -32px;
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
