import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../Register.vue'),
      meta: { requiresNoAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../Login.vue'),
      meta: { requiresNoAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const store = useMainStore()
  await store.checkIfLoggedIn()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.loggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    if (store.loggedIn) {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
