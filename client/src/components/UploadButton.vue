<template lang="pug">
  span
    v-btn.upload-button(v-if='fab', fab, small, :loading='loading')
      v-icon file_upload
      input(type='file', @change='fileSelected')
    v-btn.upload-button(small, :block='block', v-if='!fab', :loading='loading')
      span {{ title }}
      input(type='file', @change='fileSelected')
</template>

<script>
  export default {
    name: 'UploadButton',
    props: {
      fab: Boolean,
      loading: Boolean,
      selectedCallback: Function,
      title: String,
      block: Boolean
    },
    methods: {
      fileSelected (e) {
        if (this.selectedCallback) {
          if (e.target.files[0]) {
            this.selectedCallback(e.target.files[0])
          } else {
            this.selectedCallback(null)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .upload-button {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .upload-button input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }
</style>
