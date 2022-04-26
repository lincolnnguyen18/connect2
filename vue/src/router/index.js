import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '../store'
import Home from '../Home.vue'
import Register from '../Register.vue'
import Login from '../Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: () => import('../Home.vue'),
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      // component: () => import('../Register.vue'),
      component: Register,
      meta: { requiresNoAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      // component: () => import('../Login.vue'),
      component: Login,
      meta: { requiresNoAuth: true }
    },
    // get path for /messages/:id
    {
      path: '/messages/:username',
      name: 'messages',
      // component: () => import('../Messages.vue'),
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const store = useMainStore()
  // window.store = store
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
