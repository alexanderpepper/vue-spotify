<template lang="pug">
  modal-spinner
</template>

<script>
  import AuthorizationService from '../services/AuthorizationService'
  import ModalSpinner from './ModalSpinner'

  export default {
    name: 'callback',
    components: {ModalSpinner},
    props: {app: Object},
    async mounted () {
      const user = await AuthorizationService.setAuthorizationCode(this.$route.query.code)
      console.log(user)
      this.app.setUser(user)
      this.$router.push({name: 'playlists'})
    }
  }
</script>
