<template lang="pug">
  modal-spinner
</template>

<script>
  import TokenService from '../services/TokenService'
  import UserService from '../services/UserService'
  import ModalSpinner from './ModalSpinner'

  export default {
    name: 'callback',
    components: {ModalSpinner},
    props: {
      setUser: Function
    },
    async mounted () {
      await TokenService.setAuthorizationCode(this.$route.query.code)
      this.setUser(await UserService.me())
      this.$router.push({name: 'playlists'})
    }
  }
</script>
