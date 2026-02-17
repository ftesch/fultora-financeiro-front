import type { RouteRecordRaw } from 'vue-router'

export const documentsRoutes: RouteRecordRaw[] = [
  {
    path: '/financeiro/documents',
    component: () => import('./pages/index.vue'),
    meta: {
      title: 'Documetos Financeiros',
    },
  },
  {
    path: '/financeiro/documents/create',
    component: () => import('./pages/create.vue'),
    meta: {
      title: 'Gerar Parcelas',
    },
  },
]
