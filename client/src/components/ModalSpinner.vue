<template lang="pug">
  .d-flex.fill-height.w-100.text-center
    .mx-auto.align-self-center
      v-progress-circular(:size='200' :width='50', color='primary', indeterminate)
      .headline(v-text='loadingText')
</template>

<script>
export default {
  props: { loadingText: String },
  name: 'modalSpinner'
}
</script>
