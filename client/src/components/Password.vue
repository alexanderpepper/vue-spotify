<template lang="pug">
  v-card
    v-card-text
      v-layout.mb-3(row, align-center)
        .headline Change Password
        v-spacer
        v-icon.cursor-pointer(@click='app.showChangePassword = false') close
      form.mb-5(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
        v-text-field.mb-2(label='Old Password', v-model='password.oldPassword', :type="hideOldPassword ? 'password' : 'text'", :append-icon="hideOldPassword ? 'visibility' : 'visibility_off'", @click:append="() => (hideOldPassword = !hideOldPassword)", @keyup.enter='changePassword', required, hide-details)
        v-text-field.mb-2(label='New Password', v-model='password.newPassword', :type="hideNewPassword ? 'password' : 'text'", :append-icon="hideNewPassword ? 'visibility' : 'visibility_off'", @click:append="() => (hideNewPassword = !hideNewPassword)", @keyup.enter='changePassword', required, hide-details)
        v-text-field.mb-2(label='Confirm Password', v-model='confirmPassword', :type="hideConfirmPassword ? 'password' : 'text'", :append-icon="hideConfirmPassword ? 'visibility' : 'visibility_off'", @click:append="() => (hideConfirmPassword = !hideConfirmPassword)", @keyup.enter='changePassword', required, hide-details)
      v-btn(outline, block, @click='changePassword', :disabled='!buttonEnabled') Change Password
</template>

<script>
  import UserService from '../services/UserService'

  export default {
    name: 'password',
    props: {app: Object},
    data () {
      return {
        password: {
          oldPassword: '',
          newPassword: ''
        },
        confirmPassword: '',
        hideOldPassword: true,
        hideNewPassword: true,
        hideConfirmPassword: true
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
        if (this.buttonEnabled) {
          try {
            await UserService.changePassword(this.password)
            this.app.showSnackbar('Success!')
            this.app.showChangePassword = false
          } catch (error) {
            this.app.showSnackbar(error, 'error')
          }
        }
      }
    }
  }
</script>
