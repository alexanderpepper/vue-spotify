<template lang="pug">
  .folders
    .pb-3.pt-2.px-2.grey.darken-4
      v-text-field(v-model='newFolderName', append-icon='create_new_folder', :append-icon-cb='addNewFolder' hide-details, label='New Folder')
    v-layout.folders(:class='{"grey darken-4": app.isDarkTheme, "grey lighten-3": !app.isDarkTheme}')
      sl-vue-tree(v-model="app.folders.folders", @select="rowsSelected", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}')
        template(slot="toggle", slot-scope="{ node }")
          v-icon(dark, v-if="node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_drop_down
          v-icon(dark, v-if="!node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_right
        template(slot="title", slot-scope="{ node }")
          span.body-2.truncate {{ node.title }}
</template>

<script>
  import SlVueTree from 'sl-vue-tree'
  import FolderService from '../services/FolderService'

  export default {
    name: 'folders',
    components: {SlVueTree},
    props: {app: Object},
    data () {
      return {
        newFolderName: ''
      }
    },
    watch: {
      'app.folders.folders': {
        handler () {
          console.log('handler')
          if (this.app.folders) {
            FolderService.save(this.app.folders)
          }
        }
      }
    },
    methods: {
      addNewFolder () {
        this.app.folders.folders.unshift({title: this.newFolderName || 'New Folder'})
        this.newFolderName = ''
      },
      rowsSelected (rows) {
        if (rows.length === 1) {
          const row = rows[0]
          if (row.isLeaf) {
            this.$router.push({name: 'playlist', params: {id: row.data}})
          } else {
            const folder = this.app.folders.folders.find(folder => folder.isSelected)
            this.$router.push({name: 'playlists', params: {folder}})
          }
        }
      }
    }
  }
</script>
