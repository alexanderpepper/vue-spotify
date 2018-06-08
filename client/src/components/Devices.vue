<template lang="pug">
  v-card.devices
    v-list(v-if='devices.length > 0')
      v-list-tile(ripple, @click='selectDevice(device.id)', v-for='(device, index) in devices', :key='index')
        v-list-tile-content
          v-list-tile-title {{ device.name }}
    .empty(v-else) No devices found :(
</template>

<script>
  import SpotifyService from '../services/SpotifyService'

  export default {
    name: 'devices',
    props: ['isSpotifyConnected'],
    data () {
      return {
        devices: []
      }
    },
    created () {
      // this will update every 2 seconds so that the list updates when we active more players
      // TODO move to websocket
      setInterval(async () => {
        if (this.isSpotifyConnected()) {
          this.devices = (await SpotifyService.getDevices()).devices
          this.devices.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
      }, 2000)
    },
    methods: {
      selectDevice: function (deviceID) {
        SpotifyService.transferPlayback(deviceID, true)
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
