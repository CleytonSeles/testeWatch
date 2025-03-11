import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false

// Configuração global do axios
axios.defaults.baseURL = 'http://localhost:3000/api'

// Interceptor para adicionar o token de autenticação em todas as requisições
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
