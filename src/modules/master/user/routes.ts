import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/master/user',
    component: () => import('./pages/index.vue'),
  },
  {
    path: '/master/user/create',
    component: () => import('./pages/create.vue'),
  },
  {
    path: '/master/user/:id/edit',
    component: () => import('./pages/update.vue'),
  },
]
