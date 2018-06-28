<template lang="pug">
  v-layout.folders(:class='{"grey--text grey darken-4": app.isDarkTheme, "grey--text text--darken-2 grey lighten-3": !app.isDarkTheme}')
    sl-vue-tree(v-model="app.folders", @select="rowsSelected", :class='{"grey--text grey darken-4": app.isDarkTheme, "grey--text text--darken-2 grey lighten-3": !app.isDarkTheme}')
      template(slot="toggle" slot-scope="{ node }")
        v-icon(dark, v-if="node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_drop_down
        v-icon(dark, v-if="!node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_right
</template>

<script>
  import SlVueTree from 'sl-vue-tree'

  export default {
    name: 'folders',
    components: {SlVueTree},
    props: {app: Object},
    methods: {
      rowsSelected (rows) {
        if (rows.length === 1) {
          const row = rows[0]
          if (row.isLeaf) {
            this.$router.push({name: 'playlist', params: {id: row.data}})
          } else {
            let found = false
            for (let i = 0; i < this.app.folders.length && !found; i++) {
              if (this.app.folders[i].isSelected) {
                found = true
                this.app.folders[i].isExpanded = !this.app.folders[i].isExpanded
              }
            }
          }
        }
      }
    }
  }
</script>
