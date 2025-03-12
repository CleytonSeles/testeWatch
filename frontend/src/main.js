import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Configuração do Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#1DB954',
          secondary: '#191414',
          background: '#121212',
          surface: '#181818',
        }
      }
    }
  }
})
// Configuração global do axios
import axios from 'axios'
// Usar a variável de ambiente ou o valor padrão
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
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
