import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import './assets/global.css'

const app = createApp(App)

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

app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')
