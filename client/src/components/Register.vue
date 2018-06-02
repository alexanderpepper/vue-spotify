<template lang="pug">
  v-card
    v-card-text
      v-layout.mb-3(row, align-center)
        .headline Create New Account
        v-spacer
        v-icon.cursor-pointer(@click='cancel') close
      form.mb-5(@submit.prevent='register')
        v-text-field.mb-2(label='Email', v-model='credentials.email', required, hide-details)
        v-text-field.mb-2(label='Password', v-model='credentials.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility' : 'visibility_off'", :append-icon-cb="() => (hidePassword = !hidePassword)", @keyup.enter='register', required, hide-details)
        v-text-field.mb-2(label='Confirm Password', v-model='confirmPassword', :type="hideConfirmPassword ? 'password' : 'text'", :append-icon="hideConfirmPassword ? 'visibility' : 'visibility_off'", :append-icon-cb="() => (hideConfirmPassword = !hideConfirmPassword)", @keyup.enter='register', required, hide-details)
      v-btn(small, flat, block, @click='register', :disabled='!isValid()') Create New Account
      v-btn(small, flat, block, @click='login') Back to Sign In
</template>

<script>
  import UserService from '../services/UserService'
  import LoginService from '../services/LoginService'

  export default {
    name: 'register',
    props: {
      login: Function,
      cancel: Function,
      showSnackbar: Function,
      loginSuccess: Function
    },
    data () {
      return {
        hidePassword: true,
        hideConfirmPassword: true,
        confirmPassword: '',
        credentials: {
          // name: 'Spotify Explorer',
          email: '',
          password: ''
        },
        failure: false
      }
    },
    methods: {
      async register () {
        try {
          await UserService.save(this.credentials)
          await LoginService.login(this.credentials)
          this.loginSuccess()
        } catch (error) {
          this.showSnackbar(error, 'error')
        }
      },
      isValid () {
        return this.credentials.password && this.credentials.email &&
          this.credentials.password === this.confirmPassword
      }
    }
  }
</script>
