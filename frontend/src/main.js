import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// Configuração global do axios
axios.defaults.baseURL = 'http://localhost:3000/api'

// Interceptor para adicionar o token de autenticação
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Criação da aplicação Vue
const app = createApp(App)

// Registrando plugins e configurações
app.use(router)
app.use(store)
app.use(vuetify)

// Montando a aplicação no DOM
app.mount('#app')

