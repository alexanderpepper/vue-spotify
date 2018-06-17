<template lang="pug">
  v-card.devices
    v-list.py-0
      v-list-tile(ripple, @click='selectDevice(device.id)', v-for='(device, index) in app.devices', :key='index')
        v-list-tile-content
          v-list-tile-title(:class='{"primary--text": device.is_active}') {{ device.name }}
      v-list-tile.grey--text(v-if='!app.devices.length')
        v-list-tile-content
          v-list-tile-title No devices found
</template>

<script>
  import PlayerService from '../services/PlayerService'

  export default {
    name: 'devices',
    props: {app: Object},
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
