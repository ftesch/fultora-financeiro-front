import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

//const authStore = useAuthStore()

// Pages
import Login from '@/pages/auth/Login.vue'
import Marketplace from '@/pages/marketplace/Index.vue'
import App from '@/pages/app/Index.vue'

// Layout
import AppLayout from '@/components/layout/AppLayout.vue'
import GuestLayout from '@/components/layout/GuestLayout.vue'
import Register from '@/pages/auth/Register.vue'
import MarketplacePurchase from '@/pages/marketplace/MarketplacePurchase.vue'

// ⚠️ temporário (depois vira Pinia)
// const isAuthenticated = () => {
//   return false // alterar depois
// }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: GuestLayout,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
      },
    ],
  },

  {
    path: '/app',
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'app',
        component: App,
      },
      {
        path: 'marketplace',
        name: 'marketplace',
        component: Marketplace,
      },
      {
        path: 'MarketplacePurchase/:id',
        name: 'MarketplacePurchase',
        component: MarketplacePurchase,
      },
    ],
  },

  // fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global Guard
 */
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // rota protegida sem login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  return true
})

export default router
