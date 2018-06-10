<template lang="pug">
  v-card.devices
    v-list.py-0
      v-list-tile(ripple, @click='selectDevice(device.id)', v-for='(device, index) in devices', :key='index')
        v-list-tile-content
          v-list-tile-title(:class='{bold: device.is_active}') {{ device.name }}
      v-list-tile.grey--text(v-if='!devices.length')
        v-list-tile-content
          v-list-tile-title No devices found
</template>

<script>
  import PlayerService from '../services/PlayerService'

  export default {
    name: 'devices',
    props: {app: Object},
    data () {
      return {
        devices: []
      }
    },
    created () {
      // this will update every 2 seconds so that the list updates when we active more players
      setInterval(async () => {
        if (this.app.isSpotifyConnected()) {
          this.devices = (await PlayerService.getDevices()).devices
          this.devices.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
      }, 2000)
    },
    methods: {
      selectDevice: function (deviceID) {
        PlayerService.transferPlayback(deviceID, true)
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
