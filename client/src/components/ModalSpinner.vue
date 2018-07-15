<template functional lang="pug">
  v-layout.modal-spinner(fill-height, align-center)
    v-flex.text-xs-center
      v-progress-circular(:size='200' :width='50', color='primary', indeterminate)
</template>

<script>
  export default {
    name: 'modalSpinner'
  }
</script>
