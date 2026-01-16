// src/stores/modules.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMasterStore = defineStore('master', () => {
  const completedCount = ref(0)
  const steps = ref([
    {
      key: 1,
      title: 'Grupo Empresarial',
      description: 'Cadatrar as empresas que fazem parte do grupo empresarial',
      count: 0,
      route: '/master/company',
    },

    {
      key: 2,
      title: 'Usuários',
      description: 'Cadatrar Usuários e Habilitar Licenças',
      count: 0,
      route: '/master/user',
    },
    {
      key: 3,
      title: 'Categorias Financeiras',
      description: 'Cadatrar Categorias Financeiras',
      count: 0,
      route: '/master/financial_category',
    },
  ])

  const progress = ref(0)

  async function fetchData() {}

  return {
    fetchData,
    steps,
    progress,
    completedCount,
  }
})
