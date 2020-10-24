<template lang="pug">
  v-card.devices
    v-list.py-0
      v-list-item(ripple, @click='app.selectDevice(device.id)', v-for='(device, index) in app.devices', :key='index', v-once)
        v-list-item-content
          v-list-item-title(:class='{"primary--text": device.is_active}') {{ device.name }}
      v-list-item.grey--text(v-if='!app.devices.length')
        v-list-item-content
          v-list-item-title No devices found
</template>

<script>
export default {
  name: 'devices',
  props: { app: Object }
}
</script>
