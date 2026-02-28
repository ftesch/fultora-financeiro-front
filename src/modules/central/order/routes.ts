import type { RouteRecordRaw } from 'vue-router'

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/central/order',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/central/order/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/central/order/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
