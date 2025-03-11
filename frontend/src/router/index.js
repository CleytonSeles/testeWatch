import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Songs from '../views/Songs.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: {
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navegação guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  
  // Se a rota requer autenticação e o usuário não está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Se a rota deve ser escondida para usuários autenticados
  else if (to.meta.hideForAuth && isAuthenticated) {
    next('/home')
  } 
  // Caso especial: redirecionar / para /home quando autenticado
  else if (to.path === '/' && isAuthenticated) {
    next('/home')
  }
  else {
    next()
  }
})

export default router

