<template lang="pug">
  v-dialog(v-model='dialog', persistent, width='300')
    v-card
      v-card-text
        v-layout.mb-3(row, align-center)
          .headline Change Password
          v-spacer
          v-icon.cursor-pointer(@click='closeDialog') close
        form.mb-5(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field.mb-2(label='Old Password', v-model='password.oldPassword', type='password', hide-details)
          v-text-field.mb-2(label='New Password', v-model='password.newPassword', type='password', hide-details)
          v-text-field(label='Confirm Password', v-model='confirmPassword', type='password', hide-details)
        v-btn(outline, block, @click='changePassword', :disabled='!buttonEnabled') Change Password
</template>

<script>
  import UserService from '../services/UserService'

  export default {
    name: 'password',
    props: {app: Object},
    created () {
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
          this.app.showSnackbar('Success!')
          this.closeDialog()
        } catch (err) {
          console.log(err)
        }
      },
      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          this.$router.push({name: 'playlists'})
        }, 333)
      }
    }
  }
</script>
