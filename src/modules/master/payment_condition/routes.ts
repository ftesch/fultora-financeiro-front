import type { RouteRecordRaw } from 'vue-router'

export const paymentConditionRoutes: RouteRecordRaw[] = [
  {
    path: '/master/payment_condition',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/master/payment_condition/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/master/payment_condition/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
