<template functional lang="pug">
  v-card.devices
    v-list.py-0
      v-list-tile(ripple, @click='props.app.selectDevice(device.id)', v-for='(device, index) in props.app.devices', :key='index', v-once)
        v-list-tile-content
          v-list-tile-title(:class='{"primary--text": device.is_active}') {{ device.name }}
      v-list-tile.grey--text(v-if='!props.app.devices.length')
        v-list-tile-content
          v-list-tile-title No devices found
</template>

<script>
export default {
  name: 'devices',
  props: { app: Object }
}
</script>
