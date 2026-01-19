import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/master/user',
    component: () => import('./pages/index.vue'),
    meta: {
      title: 'Usuários',
    },
  },
  {
    path: '/master/user/create',
    component: () => import('./pages/create.vue'),
    meta: {
      title: 'Novo Usuário',
    },
  },
  {
    path: '/master/user/:id/edit',
    component: () => import('./pages/update.vue'),
    meta: {
      title: 'Alterar Usuário',
    },
  },
]
