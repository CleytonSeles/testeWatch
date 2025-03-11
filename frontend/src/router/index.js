import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Songs from '../views/Songs.vue'
import Playlist from '../views/Playlist.vue'
import CreatePlaylist from '../views/CreatePlaylist.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/songs',
    name: 'Songs',
    component: Songs,
    meta: { requiresAuth: true }
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: Playlist,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-playlist',
    name: 'CreatePlaylist',
    component: CreatePlaylist,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Proteção de rotas - verificar autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
