import type { RouteRecordRaw } from 'vue-router'

export const companyRoutes: RouteRecordRaw[] = [
  {
    path: '/master/company',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/master/company/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/master/company/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
