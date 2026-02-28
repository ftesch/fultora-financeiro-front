import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Criteria, PaymentOrder } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { getParams } from './utils'

const APIRoute = '/api/central/payment_order'

export const useOrderStore = defineStore('order', () => {
  const loading = ref(false)
  const items = ref<PaymentOrder[]>([])
  const item = ref<PaymentOrder | null>(null)
  const criteria = ref<Criteria>(createEmptCriteria())

  async function fetchData() {
    loading.value = true

    try {
      const params = getParams(criteria.value)
      const url = params.toString() ? `${APIRoute}?${params.toString()}` : APIRoute

      const { data } = await api.get<ApiResponse<PaymentOrder[]>>(url)

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
      const { data } = await api.post<ApiResponse<PaymentOrder>>(`${APIRoute}`, item.value)

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
      const { data } = await api.put<ApiResponse<PaymentOrder>>(
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
      const { data } = await api.get<ApiResponse<PaymentOrder>>(`${APIRoute}/${id}`)
      item.value = data.data

      return null
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  function createEmptyItem(): PaymentOrder {
    return {
      op: '',
      situacao_op: '',
      company_id: '',
      supplier_id: '',
      financial_category_id: '',
      company_accound_id: '',
      data_emissao: '',
      data_entrada: '',
      data_vencimento: '',
      data_pagamento: '',
      valor_nominal: 0,
      valor_juros: 0,
      valor_desconto: 0,
      valor_liquido: 0,
    }
  }

  function resetItem() {
    item.value = createEmptyItem()
  }

  async function fechCompanyGroupData() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/company/group`)
    return data.data
  }

  async function fechCompanyData() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/company/partner`)
    return data.data
  }

  async function fetchCategory() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/financial_category/analytics`)
    return data.data
  }

  async function fetchAccount() {
    const { data } = await api.get<ApiResponse<any[]>>(
      `/api/util/company_account?company_id=${item.value?.company_id}`,
    )
    return data.data
  }

  function createEmptCriteria(): Criteria {
    return {
      company_id: '',
      supplier_id: '',
      financial_category_id: '',
      start_date: '',
      end_date: '',
      per_page: 50,
      page: 1,
    }
  }

  function resetCriteria() {
    criteria.value = createEmptCriteria()
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
    criteria,
    resetCriteria,
    fechCompanyGroupData,
    fechCompanyData,
    fetchCategory,
    fetchAccount,
  }
})
