<template lang="pug">
  v-dialog(v-model='dialog', persistent, width='300')
    v-card
      v-toolbar
        v-toolbar-title Password
        v-spacer
        v-btn(icon, light, @click='closeDialog')
          v-icon close
      v-card-text
        form(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field(label='Old Password', v-model='password.oldPassword', type='password')
          v-text-field(label='New Password', v-model='password.newPassword', type='password')
          v-text-field(label='Confirm Password', v-model='confirmPassword', type='password')
      v-card-actions
        v-btn.primary--text(flat, @click='changePassword', :disabled='!buttonEnabled') Change Password
</template>

<script>
  import UserService from '../services/UserService'

  export default {
    name: 'password',
    props: {
      showSnackbar: Function,
      setTitle: Function
    },
    created () {
      this.setTitle('Change Password')
      setTimeout(() => {
        this.dialog = true
      })
    },
    data () {
      return {
        dialog: false,
        password: {
          oldPassword: '',
          newPassword: ''
        },
        confirmPassword: ''
      }
    },
    computed: {
      buttonEnabled: function () {
        return this.password.oldPassword &&
          this.password.newPassword && this.confirmPassword &&
          this.password.newPassword === this.confirmPassword
      }
    },
    methods: {
      async changePassword () {
        try {
          await UserService.changePassword(this.password)
          this.showSnackbar('Success!')
          this.closeDialog()
        } catch (err) {
          console.log(err)
        }
      },
      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          this.$router.push({name: 'users'})
        }, 400)
      }
    }
  }
</script>
