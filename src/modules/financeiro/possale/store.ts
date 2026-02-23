import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type PosSale, type Criteria, type PaymentMethod } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const APIRoute = '/api/financeiro/possale'

export const usePosSaleStore = defineStore('po_sale', () => {
  const loading = ref(false)
  const items = ref<PosSale[]>([])
  const item = ref<PosSale | null>(null)
  const paymentMethods = ref<PaymentMethod[]>([])
  const criteria = ref<Criteria>(createEmptCriteria())

  async function fetchData() {
    loading.value = true

    try {
      const params = new URLSearchParams()

      if (criteria.value.company_id) {
        params.append('company_id', criteria.value.company_id)
      }

      if (criteria.value.start_date) {
        params.append('start_date', criteria.value.start_date)
      }

      if (criteria.value.end_date) {
        params.append('end_date', criteria.value.end_date)
      }

      if (criteria.value.per_page) {
        params.append('per_page', String(criteria.value.per_page))
      }

      if (criteria.value.page) {
        params.append('page', String(criteria.value.page))
      }

      const url = params.toString() ? `${APIRoute}?${params.toString()}` : APIRoute
      const { data } = await api.get<ApiResponse<PosSale[]>>(url)

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
      if (!item.value) {
        throw new Error('Nenhum item carregado para salvar.')
      }

      const { data } = await api.post<ApiResponse<PosSale>>(APIRoute, item.value)

      toast.success(data.message ?? 'Registro Criado')
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
      const { data } = await api.put<ApiResponse<PosSale>>(
        `${APIRoute}/${item.value?.id}`,
        item.value,
      )

      toast.success(data.message ?? 'Movimento Alterado')
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
      const { data } = await api.get<ApiResponse<PosSale>>(`${APIRoute}/${id}`)
      item.value = data.data

      return null
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  function createEmptyItem(): PosSale {
    return {
      date: '',
      company_id: '',
      transactions: [],
    }
  }

  function createEmptCriteria(): Criteria {
    return {
      company_id: '',
      start_date: '',
      end_date: '',
      per_page: 50,
      page: 1,
    }
  }

  function resetItem() {
    item.value = createEmptyItem()
  }

  function resetCriteria() {
    criteria.value = createEmptCriteria()
  }

  async function fechCompanyGroupData() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/company/group`)
    return data.data
  }

  async function fetchTransactionsForCreate() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/financeiro/payment_method`)
    paymentMethods.value = data.data
  }

  async function initializeCreate() {
    resetItem()
    await fetchTransactionsForCreate()

    item.value!.transactions = paymentMethods.value.map((paymentMethod) => ({
      sales_payment_method_id: paymentMethod.id,
      payment_method: paymentMethod,
      valor: 0,
    }))
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
    fechCompanyGroupData,
    initializeCreate,
    criteria,
    resetCriteria,
  }
})
