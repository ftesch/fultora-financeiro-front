import type { RouteRecordRaw } from 'vue-router'

export const companyRoutes: RouteRecordRaw[] = [
  {
    path: '/master/company',
    component: () => import('./pages/index.vue'),
    meta: {
      title: 'Pessoas',
    },
  },
  {
    path: '/master/company/create',
    component: () => import('./pages/create.vue'),
    meta: {
      title: 'Nova Pessoa',
    },
  },
  {
    path: '/master/company/:id/edit',
    component: () => import('./pages/update.vue'),
    meta: {
      title: 'Atualizar Pessoa',
    },
  },
]
