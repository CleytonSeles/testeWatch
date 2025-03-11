import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#1DB954',      // Verde Spotify
          secondary: '#191414',    // Preto Spotify
          accent: '#535353',       // Cinza escuro
          background: '#121212',   // Fundo escuro
          surface: '#181818',      // Superfície escura
          error: '#FF4444',
          success: '#1DB954',
          warning: '#FB8C00',
          info: '#2196F3'
        }
      }
    }
  },
  defaults: {
    VCard: {
      rounded: 'lg',
    },
  },
  icons: {
    defaultSet: 'mdi'
  }
})

export default vuetify

