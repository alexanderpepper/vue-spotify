<template lang="pug">
  v-container(fluid)
    v-card
      v-card-title
        .headline {{ title }}
        v-spacer
      v-card-text
        form(@submit.prevent='save')
          v-text-field(label='Email', v-model='editUser.email', required)
          v-text-field(label='Password', v-model='editUser.password', v-if='!editUser.id', type='password', required)
          v-text-field(label='Confirm Password', v-model='confirmPassword', v-if='!editUser.id', type='password', required)
          div(v-if='!editProfile && user.isAdmin')
            .caption.grey--text.text--lighten-1 Roles*
            v-chip(v-for='(roleMapping, index) in editUser.roleMappings', v-model='roleMapping.enabled', :key='index', close, @input='removeRole') {{ roleMapping.role.name | capitalize }}
            v-menu(offset-y, right, v-show='availableRoles.length')
              v-btn(fab, small, slot='activator')
                v-icon add
              v-list.py-0
                v-list-tile(@click='addRole(role)', v-for='(role, index) in availableRoles', :key='index')
                  v-list-tile-title {{ role.name | capitalize }}
    v-layout.my-2(row)
      v-btn(flat, :router='true', :to='{ name: "users" }', v-if='user.isAdmin') Go Back
      v-spacer
      v-dialog(v-show='editUser.id && !editProfile && user.isAdmin', v-model='showDeleteDialog', width='300')
        v-btn(slot='activator', flat) Delete
        v-card
          v-card-title.headline Delete this user?
          v-card-text Are you sure you want to delete this user? This action cannot be undone.
          v-card-actions
            v-spacer
            v-btn(flat, @click='showDeleteDialog = false') Cancel
            v-btn(@click='deleteUser') Delete
      v-btn(@click='save', :disabled='!isValid()', outline) {{ !editUser.id ? 'Create Account' : 'Save' }}
</template>

<script>
  import UserService from '../services/UserService'
  import RoleService from '../services/RoleService'
  import { clone } from 'lodash'

  export default {
    name: 'user',
    props: {
      id: String,
      editProfile: Boolean,
      showSnackbar: Function,
      setShowBackButton: Function,
      setTitle: Function,
      setActiveMenuItem: Function,
      user: Object
    },
    data () {
      return {
        showDeleteDialog: false,
        title: '',
        roles: [],
        editUser: { roleMappings: [], photo: null },
        oldRoles: [],
        confirmPassword: '',
        uploadingPhoto: false
      }
    },
    async created () {
      this.roles = await RoleService.all()
      this.initialize()
      this.setShowBackButton(true)
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
        if (this.editUser.id) {
          return this.editUser.email
        } else {
          return this.editUser.email &&
            this.editUser.password &&
            this.confirmPassword &&
            this.editUser.password === this.confirmPassword &&
            this.editUser.password.length >= 8
        }
      },
      async initialize () {
        if (this.id) {
          this.editUser = await UserService.get(this.id)
          this.oldRoles = clone(this.editUser.roleMappings)
        }
        this.title = this.editProfile ? 'Edit Profile' : (this.editUser.id ? 'Edit User' : 'Create a New Account')
        this.setActiveMenuItem('users')
      },
      async save () {
        if (this.isValid()) {
          try {
            const savedUser = await UserService.save(this.editUser)
            if (savedUser.id !== this.editUser.id) {
              this.$router.push({ name: 'user', params: { id: savedUser.id } })
            }
            await this.updateRoles()
            this.showSnackbar('Success!')
          } catch (error) {
            this.showSnackbar(`Error: ${error}`)
          }
        }
      },
      updateRoles () {
        const promises = []
        const currentRoleIds = this.editUser.roleMappings.map(r => r.roleId)
        const oldRoleIds = this.oldRoles.map(r => r.roleId)
        this.oldRoles.forEach(r => {
          if (!currentRoleIds.includes(r.roleId)) {
            promises.push(RoleService.removeRoleMapping(r))
          }
        })
        this.editUser.roleMappings.forEach(r => {
          if (!oldRoleIds.includes(r.roleId)) {
            promises.push(RoleService.addRoleMapping(this.editUser, r.role))
          }
        })
        return Promise.all(promises)
      },
      addRole (role) {
        const roleMapping = { userId: this.editUser.id, roleId: role.id }
        roleMapping.role = this.roles.filter(r => r.id === roleMapping.roleId)[0]
        this.editUser.roleMappings.push(roleMapping)
        this.$forceUpdate()
      },
      removeRole () {
        this.editUser.roleMappings = this.editUser.roleMappings.filter(roleMapping => roleMapping.enabled !== false)
      },
      async deleteUser () {
        await UserService.remove(this.editUser)
        this.$router.push({name: 'users'})
      }
    },
    computed: {
      availableRoles () {
        const assignedRoleIds = this.editUser.roleMappings.map(roleMapping => roleMapping.role.id)
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
