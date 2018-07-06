<template lang="pug">
  .library(v-on:drop='dropped', v-on:dragover='dragover')
    .pb-3.pt-2.px-2.grey.darken-4
      v-text-field(v-model='newFolderName', append-icon='create_new_folder', :append-icon-cb='addNewFolder' hide-details, label='New Folder')
    v-layout.library(:class='{"grey darken-4": app.isDarkTheme, "grey lighten-3": !app.isDarkTheme}')
      sl-vue-tree(v-model="app.library.children", @select="rowsSelected", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}')
        template(slot="toggle", slot-scope="{ node }")
          v-icon(dark, v-if="node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_drop_down
          v-icon(dark, v-if="!node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_right
        template(slot="title", slot-scope="{ node }")
          span.body-2.truncate {{ node.title }}
</template>

<script>
  import SlVueTree from 'sl-vue-tree'
  import LibraryService from '../services/LibraryService'

  export default {
    name: 'library',
    components: {SlVueTree},
    props: {app: Object},
    data () {
      return {
        newFolderName: ''
      }
    },
    watch: {
      'app.library.children': {
        handler () {
          if (this.app.library) {
            console.log('hit the handler')
            LibraryService.save(this.app.library)
          }
        }
      }
    },
    methods: {
      closest (el, predicate) {
        do {
          if (predicate(el)) return el
          el = el && el.parentNode
        } while (el)
      },
      dragover (e) {
        e.preventDefault()
      },
      dropped (e) {
        const folder = this.closest(e.target, el => el.classList && el.classList.contains('sl-vue-tree-node-is-folder'))
        if (folder) {
          const path = folder.getAttribute('path')
          const indexes = path.substring(1, path.length - 1).split(',')
          console.log(indexes)
          // this.app.library.children[index]
          //
          // this.app.library.children.children[index]
        }
      },
      addNewFolder () {
        this.app.library.children.unshift({title: this.newFolderName || 'New Folder'})
        this.newFolderName = ''
      },
      rowsSelected (rows) {
        if (rows.length === 1) {
          const row = rows[0]
          if (row.isLeaf) {
            this.$router.push({name: 'playlist', params: {id: row.data.id}})
          } else {
            const folder = this.app.library.children.find(item => item.isSelected)
            this.$router.push({name: 'playlists', params: {folder}})
          }
        }
      }
    }
  }
</script>
