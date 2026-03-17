import type { RouteRecordRaw } from 'vue-router'

export const agendaRoutes: RouteRecordRaw[] = [
  {
    path: '/central/agenda',
    component: () => import('./pages/index.vue'),
  },
]
