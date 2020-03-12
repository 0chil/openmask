import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
