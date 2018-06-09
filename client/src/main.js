// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VMenu,
  VDivider,
  VSnackbar,
  VTextField,
  VCard,
  VDialog,
  VCheckbox,
  VChip,
  VDataTable,
  VFooter,
  VSlider,
  VProgressCircular,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'
import App from './App'
import router from './router'
import { Ripple } from 'vuetify/es5/directives'
import './main.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VMenu,
    VDivider,
    VSnackbar,
    VTextField,
    VCard,
    VDialog,
    VCheckbox,
    VChip,
    VDataTable,
    VFooter,
    VSlider,
    VProgressCircular,
    transitions
  },
  directives: {
    Ripple
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
