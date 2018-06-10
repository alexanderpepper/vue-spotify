<template lang="pug">
  v-card
    v-card-text
      v-layout.mb-3(row, align-center)
        .headline Sign In
        v-spacer
        v-icon.cursor-pointer(@click='app.closeLogin') close
      form.mb-5(@submit.prevent='login')
        input.display-none(type='email', name='fakeUsername')
        input.display-none(type='password', name='fakePassword')
        v-text-field.mb-2(label='Email', v-model='credentials.email', required, hide-details)
        v-text-field(label='Password', v-model='credentials.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility' : 'visibility_off'", :append-icon-cb="() => (hidePassword = !hidePassword)", @keyup.enter='login', required, hide-details)
      v-btn(outline, block, @click='login', :disabled='!isValid()') Sign In
      v-btn(small, flat, block, @click='app.register') Create New Account
</template>

<script>
  import LoginService from '../services/LoginService'

  export default {
    name: 'login',
    props: {app: Object},
    data () {
      return {
        hidePassword: true,
        credentials: {
          email: '',
          password: ''
        },
        failure: false
      }
    },
    methods: {
      isValid () {
        return this.credentials.password && this.credentials.email && this.credentials.email.indexOf('@') > -1
      },
      login: async function () {
        try {
          await LoginService.login(this.credentials)
          this.app.loginSuccess()
        } catch (error) {
          this.app.showSnackbar('Account not found', 'error')
        }
      }
    }
  }
</script>
