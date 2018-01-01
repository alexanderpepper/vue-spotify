<template lang="pug">
  v-container(fluid)
    v-card
      v-card-title
        .headline {{ title }}
        v-spacer
      v-card-text
        form(@submit.prevent='save')
          .d-inline-block.mb-4
            user-photo.mx-auto(size='large', :user='user')
            upload-button.d-block(:selected-callback='photoSelected', title='Upload New Photo', :loading='uploadingPhoto')
          v-text-field(label='Email', v-model='user.email', required, @blur='populateFullName')
          v-text-field(label='Name', v-model='user.name', required)
          v-text-field(label='Password', v-model='user.password', v-if='newRegistration || !user.id', type='password', required)
          v-text-field(label='Confirm Password', v-model='confirmPassword', v-if='newRegistration || !user.id', type='password', required)
          v-checkbox(label='Activated', v-model='user.activated', v-if='currentUser.isAdmin')
          div(v-if='!editProfile && currentUser.isAdmin')
            .caption.grey--text.text--lighten-1 Roles*
            v-chip(v-for='(roleMapping, index) in user.roleMappings', v-model='roleMapping.enabled', :key='index', close, @input='removeRole') {{ roleMapping.role.name | capitalize }}
            v-menu(offset-y, right, v-show='availableRoles.length')
              v-btn(fab, small, slot='activator')
                v-icon add
              v-list
                v-list-tile(@click='addRole(role)', v-for='(role, index) in availableRoles', :key='index')
                  v-list-tile-title {{ role.name | capitalize }}
    v-layout.my-2(row)
      v-btn(flat, :router='true', :to='{ name: "users" }', v-if='currentUser.isAdmin') Go Back
      v-dialog(v-show='user.id && !editProfile && currentUser.isAdmin', v-model='showDeleteDialog', width='300')
        v-btn(slot='activator') Delete User
        v-card
          v-card-title.headline Delete this user?
          v-card-text Are you sure you want to delete this user? This action cannot be undone.
          v-card-actions
            v-spacer
            v-btn(flat, @click='showDeleteDialog = false') Cancel
            v-btn(@click='deleteUser') Delete
      v-btn(@click='save', :disabled='!isValid()') {{ newRegistration ? 'Create Account' : 'Save' }}
</template>

<script>
  import UserService from '../services/UserService'
  import RoleService from '../services/RoleService'
  import UploadService from '../services/UploadService'
  import { clone } from 'lodash'
  import UploadButton from './UploadButton'
  import UserPhoto from './UserPhoto.vue'
  import GravatarService from '../services/GravatarService'

  export default {
    name: 'user',
    props: ['id', 'editProfile', 'showSnackbar', 'setTitle', 'setActiveMenuItem', 'currentUser'],
    components: {UploadButton, UserPhoto},
    data () {
      return {
        showDeleteDialog: false,
        title: '',
        roles: [],
        user: { roleMappings: [], photo: null },
        oldRoles: [],
        newRegistration: false,
        confirmPassword: '',
        uploadingPhoto: false
      }
    },
    async created () {
      this.roles = await RoleService.all()
      this.initialize()
      this.newRegistration = !this.currentUser.id
    },
    watch: {
      $route: {
        handler () {
          this.initialize()
        }
      }
    },
    methods: {
      isValid () {
        if (this.user.id) {
          return this.user.email && this.user.name
        } else {
          return this.user.email && this.user.name &&
            this.user.password && this.confirmPassword &&
            this.user.password === this.confirmPassword &&
            this.user.password.length >= 8
        }
      },
      async initialize () {
        if (this.id) {
          this.user = await UserService.get(this.id)
          this.oldRoles = clone(this.user.roleMappings)
        }
        this.title = this.editProfile ? 'Edit Profile' : (this.user.id ? 'Edit User' : 'Create a New Account')
        this.setActiveMenuItem('users')
      },
      async save () {
        if (this.isValid()) {
          try {
            const savedUser = await UserService.save(this.user)
            if (this.newRegistration) {
              console.log(savedUser)
              this.$router.push({name: 'registerConfirm', params: {user: savedUser}})
            } else {
              if (savedUser.id !== this.user.id) {
                this.$router.push({ name: 'user', params: { id: savedUser.id } })
              }
              await this.updateRoles()
              this.showSnackbar('Success!')
            }
          } catch (error) {
            this.showSnackbar(`Error: ${error}`)
          }
        }
      },
      updateRoles () {
        const promises = []
        const currentRoleIds = this.user.roleMappings.map(r => r.roleId)
        const oldRoleIds = this.oldRoles.map(r => r.roleId)
        this.oldRoles.forEach(r => {
          if (!currentRoleIds.includes(r.roleId)) {
            promises.push(RoleService.removeRoleMapping(r))
          }
        })
        this.user.roleMappings.forEach(r => {
          if (!oldRoleIds.includes(r.roleId)) {
            promises.push(RoleService.addRoleMapping(this.user, r.role))
          }
        })
        return Promise.all(promises)
      },
      addRole (role) {
        const roleMapping = { userId: this.user.id, roleId: role.id }
        roleMapping.role = this.roles.filter(r => r.id === roleMapping.roleId)[0]
        this.user.roleMappings.push(roleMapping)
        this.$forceUpdate()
      },
      removeRole () {
        this.user.roleMappings = this.user.roleMappings.filter(roleMapping => roleMapping.enabled !== false)
      },
      async deleteUser () {
        await UserService.remove(this.user)
        this.$router.push({name: 'users'})
      },
      populateFullName () {
        const isEmail = () => this.user.email.indexOf('@') > -1 && this.user.email.indexOf('.') > 1
        if ((this.newRegistration || !this.user.id) && isEmail()) {
          const username = this.user.email.split('@')[0]
          this.user.name = username
            .split('.')
            .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
            .join(' ')
          this.user.photo = GravatarService.getProfilePhotoUrl(this.user.email)
          this.$forceUpdate()
        }
      },
      async photoSelected (file) {
        this.uploadingPhoto = true
        this.user.photo = await UploadService.uploadFile(file)
        this.uploadingPhoto = false
      }
    },
    computed: {
      availableRoles () {
        const assignedRoleIds = this.user.roleMappings.map(roleMapping => roleMapping.role.id)
        return this.roles.filter(role => {
          return !assignedRoleIds.includes(role.id)
        })
      }
    }
  }
</script>

<style scoped>
  .avatar img {
    width: 100%;
  }
</style>
