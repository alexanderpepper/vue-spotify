<template lang="pug">
  v-card
    v-card-text
      v-layout.mb-3(row, align-center)
        .headline Create New Account
        v-spacer
        v-icon.cursor-pointer(@click='app.showRegister = false') close
      form.mb-5(@submit.prevent='register')
        v-text-field.mb-2(label='Email', v-model='credentials.email', required, hide-details)
        v-text-field.mb-2(label='Password', v-model='credentials.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility' : 'visibility_off'", @click:append="() => (hidePassword = !hidePassword)", @keyup.enter='register', required, hide-details)
        v-text-field.mb-2(label='Confirm Password', v-model='confirmPassword', :type="hideConfirmPassword ? 'password' : 'text'", :append-icon="hideConfirmPassword ? 'visibility' : 'visibility_off'", @click:append="() => (hideConfirmPassword = !hideConfirmPassword)", @keyup.enter='register', required, hide-details)
      v-btn.mb-3(outline, block, @click='register', :disabled='!isValid()') Register
      v-btn(small, flat, block, @click='showLogin') Back to Sign In
</template>

<script>
  import UserService from '../services/UserService'
  import LoginService from '../services/LoginService'

  export default {
    name: 'register',
    props: {app: Object},
    data () {
      return {
        hidePassword: true,
        hideConfirmPassword: true,
        confirmPassword: '',
        credentials: {
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
          this.app.loginSuccess()
        } catch (error) {
          this.app.showSnackbar(error, 'error')
        }
      },
      showLogin () {
        this.app.showLogin = true
        this.app.showRegister = false
      },
      isValid () {
        return this.credentials.password && this.credentials.email &&
          this.credentials.password === this.confirmPassword
      }
    }
  }
</script>
