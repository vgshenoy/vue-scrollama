import Vue from 'vue'
import Demo from './Demo.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Demo)
}).$mount('#app')
