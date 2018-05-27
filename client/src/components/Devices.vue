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
    data () {
      return {
        devices: []
      }
    },
    async created () {
      // this will update every 2 seconds so that the list updates when we active more players
      // TODO move to websocket
      const updateDevices = async () => {
        this.devices = await SpotifyService.getDevices()
        this.devices = this.devices.devices.sort(sortByIgnoreCase)
        setTimeout(updateDevices, 2000)

        // var array = [ "Spotify .5 Web Player", "iPad cua Mac", "Mac's iMac" ]

        function sortByIgnoreCase (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          return 0
        }
      }

      updateDevices()
    },
    methods: {
      selectDevice: function (deviceID) {
        console.log('switching to', deviceID)
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
