import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { hideLayout: true, guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/student',
    name: 'Student',
    component: () => import('@/views/StudentView.vue'),
    meta: { requiresAuth: true, requiresStudent: true }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('@/views/ResultsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory('/quiz-app-Front-end/'),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next(isAdmin ? '/admin' : '/student')
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/student')
  }

  if (to.meta.requiresStudent && isAdmin) {
    return next('/admin')
  }

  next()
})

export default router