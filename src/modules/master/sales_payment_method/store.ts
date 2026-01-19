import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SalesPaymentMethod } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const APIRoute = '/api/master/sales_payment_method'

export const useSalesPaymentMethodStore = defineStore('salespaymentmethodstore', () => {
  const loading = ref(false)
  const items = ref<SalesPaymentMethod[]>([])
  const item = ref<SalesPaymentMethod | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<SalesPaymentMethod[]>>(`${APIRoute}`)

      items.value = data.data
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  async function storeData() {
    loading.value = true

    try {
      const { data } = await api.post<ApiResponse<SalesPaymentMethod>>(`${APIRoute}`, item.value)

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
      const { data } = await api.put<ApiResponse<SalesPaymentMethod>>(
        `${APIRoute}/${item.value?.id}`,
        item.value,
      )

      item.value = data.data
      toast.success(data.message ?? 'Usuario Atualizado')

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
        const { data } = await api.get<ApiResponse<SalesPaymentMethod>>(`${APIRoute}/${id}`)
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

  function createEmptyItem(): SalesPaymentMethod {
    return {
      order: '',
      category_id: '',
      acquirer_id: '',
      payment_method: '',
      payment_term_options: '',
      payment_term_days: '',
      payment_tax: '',
      active: 1,
    }
  }

  async function fechCategoryData() {
    return await api.get<ApiResponse<any[]>>(`/api/util/financial_category/analytics`)
  }

  async function fechCompanyData() {
    return await api.get<ApiResponse<any[]>>(`/api/util/company/partner`)
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
    fechCategoryData,
    fechCompanyData,
  }
})
