<template lang="pug">
  modal-spinner
</template>

<script>
  import AuthorizationService from '../services/AuthorizationService'
  import UserService from '../services/UserService'
  import ModalSpinner from './ModalSpinner'

  export default {
    name: 'callback',
    components: {ModalSpinner},
    props: {app: Object},
    async mounted () {
      await AuthorizationService.setAuthorizationCode(this.$route.query.code)
      this.app.setUser(await UserService.me())
      this.$router.push({name: 'home'})
    }
  }
</script>
