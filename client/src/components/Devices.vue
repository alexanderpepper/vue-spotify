<template lang="pug">
  .devices
    v-list(v-if='devices.length > 0')
      v-list-tile(ripple, @click='selectDevice(device.id)', v-for='(device, index) in devices', :key='index')
        v-list-tile-content
          v-list-tile-title {{ device.name }}
    .empty(v-else) No devices found :(
    v-btn(flat, large, color="primary", @click='goBack()') Back
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
        this.devices = (await SpotifyService.getDevices()).devices
        this.devices.sort(sortByIgnoreCase)
        setTimeout(updateDevices, 2000)

        // var array = [ "Spotify .5 Web Player", "iPad cua Mac", "Mac's iMac" ]

        function sortByIgnoreCase (a, b) {
          if (a.toLowerCase() < b.toLowerCase()) return -1
          if (a.toLowerCase() > b.toLowerCase()) return 1
          return 0
        }
      }

      updateDevices()
    },
    methods: {
      selectDevice: function (deviceID) {
        console.log('switching to', deviceID)
        SpotifyService.transferPlayback(deviceID, true)
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
