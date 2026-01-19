import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

//const authStore = useAuthStore()

// Pages
import Login from '@/pages/auth/Login.vue'
import Marketplace from '@/pages/marketplace/Index.vue'
import App from '@/pages/app/Index.vue'
import Master from '@/pages/master/Index.vue'

// Layout
import AppLayout from '@/components/layout/AppLayout.vue'
import GuestLayout from '@/components/layout/GuestLayout.vue'
import Register from '@/pages/auth/Register.vue'
import MarketplacePurchase from '@/pages/marketplace/MarketplacePurchase.vue'
import NotFound from '@/pages/NotFound.vue'
import MasterLayout from '@/components/layout/MasterLayout.vue'
import { userRoutes } from '@/modules/master/user/routes'
import { companyRoutes } from '@/modules/master/company/routes'
import { FinancialCategoryRoutes } from '@/modules/master/financial_category/routes'
import ResetPassword from '@/pages/auth/ResetPassword.vue'
import ForgotPassord from '@/pages/auth/ForgotPassord.vue'
import { salesPaymentMethodRoutes } from '@/modules/master/sales_payment_method/routes'

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
        meta: {
          title: 'Registrar',
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: 'Reset de Senha',
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassord,
        meta: {
          title: 'Recuperar Senha',
        },
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
        meta: {
          title: 'Marketplace',
        },
      },
      {
        path: 'MarketplacePurchase/:id',
        name: 'MarketplacePurchase',
        component: MarketplacePurchase,
        meta: {
          title: 'Marketplace',
        },
      },
    ],
  },

  {
    path: '/master',
    component: MasterLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/master/home',
      },
      {
        path: 'home',
        name: 'master.home',
        component: Master,
        meta: {
          title: 'Master',
        },
      },
      ...userRoutes,
      ...companyRoutes,
      ...FinancialCategoryRoutes,
      ...salesPaymentMethodRoutes,
    ],
  },
  // fallback
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global Guard
 */

router.afterEach((to) => {
  const defaultTitle = 'Fultora Core'
  document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // rota protegida sem login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  return true
})

export default router
