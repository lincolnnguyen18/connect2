import { createRouter, createWebHistory } from 'vue-router'
import Register from '../Register.vue'
import Login from '../Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../Login.vue')
    },
  ]
})

export default router
