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
    props: {
      setUser: Function
    },
    async mounted () {
      await AuthorizationService.setAuthorizationCode(this.$route.query.code)
      this.setUser(await UserService.me())
      this.$router.push({name: 'playlists'})
    }
  }
</script>
