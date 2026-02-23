import type { RouteRecordRaw } from 'vue-router'

export const posSaleRoutes: RouteRecordRaw[] = [
  {
    path: '/financeiro/pos_sale',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/financeiro/pos_sale/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/financeiro/pos_sale/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
