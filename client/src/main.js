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
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

import App from './App'
import router from './router'

import { Ripple } from 'vuetify/es5/directives'

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
    transitions
  },
  directives: {
    Ripple
  }
})

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.split([' ']).map(c => { return c[0].toUpperCase() + c.slice(1) }).join(' ')
})

Vue.filter('delimited', function (value) {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
