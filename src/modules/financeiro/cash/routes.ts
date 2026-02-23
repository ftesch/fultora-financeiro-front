import type { RouteRecordRaw } from 'vue-router'

export const cashRoutes: RouteRecordRaw[] = [
  {
    path: '/financeiro/cash',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/financeiro/cash/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/financeiro/cash/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
