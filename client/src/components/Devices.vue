<template lang="pug">
  v-card.devices
    v-list(v-if='devices.length > 0')
      v-list-tile(ripple, @click='selectDevice(device.id)', v-for='(device, index) in devices', :key='index')
        v-list-tile-content
          v-list-tile-title {{ device.name }}
    .empty(v-else) No devices found :(
</template>

<script>
  /*
  {
  "devices" : [ {
    "id" : "b46689a4cd5",
    "is_active" : true,
    "is_restricted" : false,
    "name" : "Your MacBook",
    "type" : "Computer",
    "volume_percent" : 70
  }, {
    "id" : "0d184899bc8",
    "is_active" : false,
    "is_restricted" : false,
    "name" : "Living Room",
    "type" : "TV",
    "volume_percent" : 25
  }, {
    "id" : "2f3c360198ede6",
    "is_active" : false,
    "is_restricted" : false,
    "name" : "Office Speaker",
    "type" : "Unknown",
    "volume_percent" : 82
  } ]
}
   */
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
