<template lang="pug">
  .library(:class='libraryClass')
    v-layout(align-center)
      v-flex(xs6)
        .caption.mt-2.pl-2.ml-1(style='letter-spacing: 2px;') PLAYLISTS
      v-flex.text-xs-right(xs6)
        v-btn.primary--text(icon, small, @click='showCreateDialog')
          v-icon create_new_folder
    v-layout
      sl-vue-tree(ref='tree', v-model="app.library.children", @nodecontextmenu='showMenu', @nodedblclick='nodeDoubleClicked', @select="rowsSelected", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}')
        template(slot="toggle", slot-scope="{ node }")
          v-icon(dark, v-if="node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_drop_down
          v-icon(dark, v-if="!node.isExpanded", :class='{"grey--text": app.isDarkTheme, "grey--text text--darken-2": !app.isDarkTheme}') arrow_right
        template(slot="title", slot-scope="{ node }")
          span.body-1.truncate {{ node.title }}
          v-icon.primary--text.ml-1(small, @click='shuffleFolder(node)', v-if='!node.isLeaf') shuffle
    v-menu(v-model='menu.show', :position-x='menu.x', :position-y='menu.y', absolute, offset-y)
      v-list.py-0
        v-list-tile(@click='showCreateDialog', ripple)
          v-list-tile-title New Folder
        v-list-tile(v-show='!selectedNode.isLeaf', @click='showRenameDialog', ripple)
          v-list-tile-title Rename
        v-list-tile(v-show='!selectedNode.isLeaf', @click='showDeleteDialog', ripple)
          v-list-tile-title Delete
    v-dialog(v-model='nameDialog.show', persistent, max-width='290')
      v-card
        v-card-title.headline {{ nameDialog.create ? 'Create' : 'Rename' }} Folder
        v-card-text
          v-text-field(v-model='nameDialog.name', label='Folder Name', @keyup.enter='nameDialog.create ? createFolder() : renameFolder()')
        v-card-actions
          v-spacer
          v-btn(flat, @click='nameDialog.show = false') Cancel
          v-btn(v-if='nameDialog.create', @click='createFolder') Create
          v-btn(v-else, @click='renameFolder') Rename
    v-dialog(v-model='deleteDialog.show', persistent, max-width='290')
      v-card
        v-card-title.headline Delete Folder
        v-card-text
          span Are you sure you want to delete&nbsp;
          strong {{ selectedNode.title }}
          span ?
        v-card-actions
          v-spacer
          v-btn(flat, @click='deleteDialog.show = false') Cancel
          v-btn(color='error', @click='deleteFolder') Delete
    v-dialog(v-model='deleteRulesDialog.show', persistent, max-width='290')
      v-card
        v-card-title.headline Can't Delete Folder
        v-card-text
          span Only empty folders can be deleted.
        v-card-actions
          v-spacer
          v-btn(@click='deleteRulesDialog.show = false') OK
</template>

<script>
  import SlVueTree from 'sl-vue-tree'
  import LibraryService from '../services/LibraryService'
  import PlaylistArtwork from './PlaylistArtwork'
  import PlayerService from '../services/PlayerService'

  export default {
    name: 'library',
    components: {SlVueTree, PlaylistArtwork},
    props: {app: Object},
    computed: {
      libraryClass () {
        return {
          'grey darken-4': this.app.isDarkTheme && this.$vuetify.breakpoint.smAndUp,
          'grey lighten-4': !this.app.isDarkTheme && this.$vuetify.breakpoint.smAndUp,
          'grey darken-3': this.app.isDarkTheme && this.$vuetify.breakpoint.xsOnly,
          'grey lighten-5': !this.app.isDarkTheme && this.$vuetify.breakpoint.xsOnly
        }
      }
    },
    data () {
      return {
        selectedNode: {},
        nameDialog: {
          create: false,
          show: false,
          name: ''
        },
        deleteDialog: {
          show: false
        },
        deleteRulesDialog: {
          show: false
        },
        menu: {
          show: false,
          x: 0,
          y: 0
        }
      }
    },
    watch: {
      'app.library.children': {
        handler () {
          if (this.app.library) {
            this.saveLibrary()
          }
        }
      }
    },
    methods: {
      shuffleFolder (node) {
        PlayerService.shuffleFolder(node.path).then(() => {
          console.log('shuffling')
        })
      },
      saveLibrary () {
        LibraryService.save(this.app.library).then(() => {
          this.app.showSnackbar('Library Saved')
        })
      },
      showRenameDialog () {
        this.nameDialog = {
          create: false,
          show: true,
          name: this.selectedNode.title
        }
      },
      showCreateDialog () {
        this.nameDialog = {
          create: true,
          show: true,
          name: ''
        }
      },
      showDeleteDialog () {
        if (this.selectedNode.children.length) {
          this.deleteRulesDialog.show = true
        } else {
          this.deleteDialog = {
            show: true
          }
        }
      },
      showMenu (node, event) {
        event.preventDefault()
        this.selectedNode = node
        this.menu = {
          show: false,
          x: event.clientX,
          y: event.clientY
        }
        this.$nextTick(() => {
          this.menu.show = true
        })
      },
      nodeDoubleClicked (node) {
        if (node.isLeaf) return
        const folder = this.folderAtPath(node.path)
        folder.isExpanded = !folder.isExpanded
      },
      createFolder () {
        this.app.library.children.unshift({title: this.nameDialog.name || 'New Folder'})
        this.nameDialog.show = false
      },
      renameFolder () {
        const folder = this.folderAtPath(this.selectedNode.path)
        folder.title = this.nameDialog.name
        this.nameDialog.show = false
      },
      deleteFolder () {
        this.$refs.tree.remove([this.selectedNode.path])
        this.deleteDialog.show = false
      },
      rowsSelected (rows) {
        if (rows.length === 1) {
          const row = rows[0]
          if (row.isLeaf) {
            this.$router.push({name: 'playlist', params: {id: row.data.id}})
          } else {
            this.$router.push({name: 'playlists', query: {path: row.path.join(',')}})
          }
        }
      },
      folderAtPath (path) {
        return path.reduce((node, index) => node.children[index], this.app.library)
      }
    }
  }
</script>
