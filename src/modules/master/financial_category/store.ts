import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FinancialCategory } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const APIRoute = '/api/master/financial_category'

export const useFinancialCategoryStore = defineStore('FinancialCategory', () => {
  const loading = ref(false)
  const items = ref<FinancialCategory[]>([])
  const item = ref<FinancialCategory | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<FinancialCategory[]>>(`${APIRoute}`)

      items.value = data.data
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  async function fechOnlyData() {
    return await api.get<ApiResponse<any[]>>(`/api/util/financial_category/search`)
  }

  async function storeData() {
    loading.value = true

    try {
      const { data } = await api.post<ApiResponse<FinancialCategory>>(`${APIRoute}`, item.value)

      item.value = data.data
      items.value.push(data.data)
      toast.success(data.message ?? 'Registro Criado')
      return data.data
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateData() {
    loading.value = true

    try {
      const { data } = await api.put<ApiResponse<FinancialCategory>>(
        `${APIRoute}/${item.value?.id}`,
        item.value,
      )

      item.value = data.data
      toast.success(data.message ?? 'Registro Atualizado')

      return data.data
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function findById(id: string) {
    loading.value = true

    try {
      const found = items.value.find((item) => String(item.id) === String(id))

      if (found) {
        item.value = { ...found }
        return item.value
      } else {
        const { data } = await api.get<ApiResponse<FinancialCategory>>(`${APIRoute}/${id}`)
        item.value = data.data
      }

      return null
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  function createEmptyItem(): FinancialCategory {
    return {
      name: '',
      type: 'D',
      account: '',
      level: 0,
      financial_category_id: null,
      financialParent: null,
    }
  }

  function resetItem() {
    item.value = createEmptyItem()
  }

  return {
    resetItem,
    loading,
    items,
    item,
    findById,
    fetchData,
    storeData,
    updateData,
    fechOnlyData,
  }
})
