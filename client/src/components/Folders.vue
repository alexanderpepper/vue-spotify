<template lang="pug">
  v-layout.folders
    sl-vue-tree(v-model="app.folders")
      template(slot="toggle" slot-scope="{ node }")
        v-icon(dark, v-if="node.isExpanded") arrow_drop_down
        v-icon(dark, v-if="!node.isExpanded") arrow_right
      template(slot="title" slot-scope="{ node }")
        v-icon(dark, v-if="node.isLeaf") queue_music
        v-icon(dark, v-if="!node.isLeaf") folder
        span.ml-2 {{ node.title }}

</template>

<script>
  import SlVueTree from 'sl-vue-tree'

  export default {
    name: 'folders',
    components: {SlVueTree},
    props: {app: Object}
  }
</script>
