<template functional lang="pug">
  .d-flex.fill-height.w-100.text-center
    .mx-auto.align-self-center
      .headline(v-text='props.loadingText')
</template>

<script>
export default {
  props: { loadingText: String },
  name: 'modalSpinner'
}
</script>
