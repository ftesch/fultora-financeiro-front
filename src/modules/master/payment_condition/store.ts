import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentCondition } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const APIRoute = '/api/master/payment_condition'

export const usePaymentConditionStore = defineStore('payment_condition', () => {
  const loading = ref(false)
  const items = ref<PaymentCondition[]>([])
  const item = ref<PaymentCondition | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<PaymentCondition[]>>(`${APIRoute}`)

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
      const { data } = await api.post<ApiResponse<PaymentCondition>>(`${APIRoute}`, item.value)

      item.value = data.data
      items.value.push(data.data)
      toast.success(data.message ?? 'Registro Criado')

      resetItem()

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
      const { data } = await api.put<ApiResponse<PaymentCondition>>(
        `${APIRoute}/${item.value?.id}`,
        item.value,
      )

      item.value = data.data
      toast.success(data.message ?? 'Condição de Pagamento Atualizado')

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
        const { data } = await api.get<ApiResponse<PaymentCondition>>(`${APIRoute}/${id}`)
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

  function createEmptyItem(): PaymentCondition {
    return {
      title: '',
      is_boleto: 1,
      active: 1,
      start_in: '',
      condition: '',
      created: null,
      updated: null,
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
  }
})
