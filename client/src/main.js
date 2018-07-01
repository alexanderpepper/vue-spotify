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
import {Ripple} from 'vuetify/es5/directives'
import './common.css'
import './sl-vue-tree.css'

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
  },
  theme: {
    primary: '#1db954'
  }
})

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.split([' ']).map(c => {
    return c[0].toUpperCase() + c.slice(1)
  }).join(' ')
})

Vue.filter('delimited', function (value) {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

/* eslint-disable no-extend-native */
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined')
      }
      const o = Object(this)
      const len = o.length >>> 0
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }
      const thisArg = arguments[1]
      let k = 0
      while (k < len) {
        const kValue = o[k]
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue
        }
        k++
      }
      return undefined
    },
    configurable: true,
    writable: true
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
