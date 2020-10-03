import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './common.css'
import './sl-vue-tree.css'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 2.0,
  lazyComponent: true
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
