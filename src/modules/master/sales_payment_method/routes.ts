import type { RouteRecordRaw } from 'vue-router'

export const salesPaymentMethodRoutes: RouteRecordRaw[] = [
  {
    path: '/master/sales_payment_method',
    component: () => import('./pages/index.vue'),
    meta: {
      title: 'Metodos de Pagamento',
    },
  },
  {
    path: '/master/sales_payment_method/create',
    component: () => import('./pages/create.vue'),
    meta: {
      title: 'Novo Metodo de Pagamento',
    },
  },
  {
    path: '/master/sales_payment_method/:id/edit',
    component: () => import('./pages/update.vue'),
    meta: {
      title: 'Alterar Metodo de Pagamento',
    },
  },
]
