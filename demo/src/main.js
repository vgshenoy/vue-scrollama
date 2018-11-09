import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

Vue.use(VueAnalytics, {
  id: 'UA-78239545-5'
})

Vue.prototype.$store = {
  offset: 0.7
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
