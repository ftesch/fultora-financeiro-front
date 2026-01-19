import type { RouteRecordRaw } from 'vue-router'

export const FinancialCategoryRoutes: RouteRecordRaw[] = [
  {
    path: '/master/financial_category',
    component: () => import('./pages/index.vue'),
    meta: {
      title: 'Categorias',
    },
  },
  {
    path: '/master/financial_category/create',
    component: () => import('./pages/create.vue'),
    meta: {
      title: 'Nova Categoria',
    },
  },
  {
    path: '/master/financial_category/:id/edit',
    component: () => import('./pages/update.vue'),
    meta: {
      title: 'Alterar Categoria',
    },
  },
]
