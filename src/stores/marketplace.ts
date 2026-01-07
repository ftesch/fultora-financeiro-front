import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Modules, Plans, PurchasePlan } from '@/types/marketplace'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { useCompanyStore } from './company'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const modules = ref<Modules[]>([])
  const purchaseProduct = ref<Modules | null>(null)
  const purchasePlan = ref<PurchasePlan | null>(null)
  const loading = ref(false)

  async function fetchModules() {
    loading.value = true

    try {
      const { data } = await api.get('/api/marketplace')

      modules.value = data.data.modules
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  async function buyPlan() {
    loading.value = true
    try {
      const { data } = await api.post('/api/marketplace', purchasePlan.value)

      toast(data.data)
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  function setPurchaseProduct(id: string) {
    const product = modules.value.find((module) => module.id === id)

    if (!product) {
      return
    }

    purchaseProduct.value = {
      ...product,
    }
  }

  function setPurchasePlan(plan: Plans) {
    if (!purchaseProduct.value) {
      return
    }

    purchasePlan.value = {
      ...plan,
      quantity: 1,
      module: purchaseProduct.value.module,
    }
  }

  return {
    modules,
    fetchModules,
    loading,
    setPurchaseProduct,
    purchaseProduct,
    setPurchasePlan,
    purchasePlan,
    buyPlan,
  }
})
