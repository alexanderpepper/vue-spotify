<template lang="pug">
  modal-spinner
</template>

<script>
import AuthorizationService from '../services/AuthorizationService'
import ModalSpinner from '../components/ModalSpinner'

export default {
  name: 'callback',
  components: { ModalSpinner },
  props: { app: Object },
  async mounted () {
    const user = await AuthorizationService.setAuthorizationCode(this.$route.query.code)
    this.app.setUser(user)
    this.$router.push({ name: 'playlists' })
  }
}
</script>
