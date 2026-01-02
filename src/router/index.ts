import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

//const authStore = useAuthStore()


// Pages
import Login from '@/pages/auth/Login.vue'
import Marketplace from '@/pages/marketplace/Index.vue'

// Layout
import AppLayout from '@/components/layout/AppLayout.vue'
import GuestLayout from '@/components/layout/GuestLayout.vue'
import Register from '@/pages/auth/Register.vue'

// ⚠️ temporário (depois vira Pinia)
// const isAuthenticated = () => {
//   return false // alterar depois
// }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: GuestLayout,
    meta: {
      guest: true,
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
        }
    ]
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
        redirect: { name: 'marketplace' },
      },
      {
        path: 'marketplace',
        name: 'marketplace',
        component: Marketplace,
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

  const authStore = useAuthStore() // ✅ aqui é seguro

  console.log("global Auth", authStore.user)

  // rota protegida sem login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // rota de guest mas usuário já logado
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'marketplace' }
  }
})

export default router
