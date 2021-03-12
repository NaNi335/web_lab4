import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'

// axios.defaults.headers.common.Authorization = `Token ${localStorage.getItem('token')}`
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.common['Content-Type'] = 'application/json'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

axios.defaults.headers.common['Content-Type'] = 'application/json'

new Vue({
  router,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
