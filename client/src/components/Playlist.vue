<template lang="pug">
  .playlist
    v-btn(flat, large, color="primary", @click='goBack()') Back
    v-btn(flat, large, color="primary", @click='goToPickDevice()') Pick Device
    v-layout.px-4.pt-4(row, wrap, align-center)
      v-flex(xs12, sm3)
        img.elevation-10(v-if='playlist.images[0]', :src='playlist.images[0].url')
        .no-image.elevation-10(v-else) No image found
      v-flex.px-4.text-sm-left.text-xs-center(xs12, sm9)
        .display-1 {{ playlist.name }}
      v-flex.hidden-xs-only(md3, offset-md9, sm6, offset-sm6, xs12)
        v-text-field(v-model='search', placeholder='Filter tracks', append-icon='search', hide-details)
    v-list.px-2.hidden-sm-and-up(two-line)
      v-list-tile(ripple, @click='playSong(track.uri)', v-for='(track, i) in tracks', :key='i')
        v-list-tile-content
          v-list-tile-title {{ track.title }}
          v-list-tile-sub-title {{ track.artist }} • {{ track.album }}
    v-data-table.px-4.hidden-xs-only(:headers='headers', :items='tracks', :loading='loading', :search='search', no-data-text='Loading playlist...', hide-actions)
      template(slot='items', slot-scope='props')
        tr(@click='playSong(props.item.uri)')
          td {{ props.item.title }}
          td {{ props.item.artist }}
          td {{ props.item.album }}
          td.text-xs-right {{ props.item.duration }}
</template>

<script>
  import SpotifyService from '../services/SpotifyService'
  import moment from 'moment'

  export default {
    name: 'playlist',
    props: ['id'],
    data () {
      return {
        headers: [
          {text: 'Title', value: 'title', align: 'left'},
          {text: 'Artist', value: 'artist', align: 'left'},
          {text: 'Album', value: 'album', align: 'left'},
          {text: 'Duration', value: 'duration', align: 'right'}
        ],
        playlist: {images: []},
        tracks: [],
        loading: true,
        search: '',
        audio: undefined
      }
    },
    async created () {
      // TODO consider caching images
      this.playlist = await SpotifyService.getPlaylist(this.id)
      this.tracks = this.playlist.tracks.items.map(item => {
        const durationMs = item.track.duration_ms
        return {
          title: item.track.name,
          artist: item.track.artists.map(a => a.name).join(', '),
          album: item.track.album.name,
          uri: item.track.uri,
          duration: moment.utc(durationMs).format(durationMs > 3600000 ? 'HH:mm:ss' : 'mm:ss')
        }
      })
      this.loading = false
      this.audio = new Audio()
    },
    methods: {
      playSong: async function (uri) {
        console.log('Trying to play', uri)
        SpotifyService.play(uri)
      },
      goToPickDevice () {
        this.$router.push({name: 'devices'})
      },
      goBack: function () {
        this.$router.go(-1)
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
  img {
    width: 100%
  }

  .no-image {
    width: 100%;
    height: 100%;
    background-color: #c0ffee;
    line-height:240px;
    vertical-align: middle;
    text-align: center;
  }
</style>
