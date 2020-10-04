<template functional lang="pug">
  v-layout.modal-spinner(fill-height, align-center)
    v-flex.text-xs-center
      // v-progress-circular(:size='200' :width='50', color='primary', indeterminate)
      .headline(v-text='props.loadingText')
</template>

<script>
export default {
  props: { loadingText: String },
  name: 'modalSpinner'
}
</script>
