<template lang="pug">
  v-layout.modal-spinner(fill-height, align-center)
    v-flex.text-xs-center
      v-progress-circular(:size="100" :width="10", indeterminate)
</template>

<script>
  export default {
    name: 'modalSpinner'
  }
</script>
