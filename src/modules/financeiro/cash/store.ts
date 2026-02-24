import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Criteria, Movimento } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { getParams, getDate } from './utils'

const APIRoute = '/api/financeiro/cash'

export const useCashStore = defineStore('cash', () => {
  const loading = ref(false)
  const items = ref<Movimento[]>([])
  const movimento = ref<Movimento>(createEmptyMovimento())
  const criteria = ref<Criteria>(createEmptCriteria())

  async function fetchData() {
    loading.value = true

    try {
      const params = getParams(criteria.value)
      const url = params.toString() ? `${APIRoute}?${params.toString()}` : APIRoute
      const { data } = await api.get<ApiResponse<Movimento[]>>(url)

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
      const { data } = await api.post<ApiResponse<Movimento>>(`${APIRoute}`, movimento.value)
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
      const { data } = await api.put<ApiResponse<Movimento>>(
        `${APIRoute}/${movimento.value?.id}`,
        movimento.value,
      )

      movimento.value = data.data
      toast.success(data.message ?? 'Movimento Atualizado')
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
      const { data } = await api.get<ApiResponse<Movimento>>(`${APIRoute}/${id}`)
      movimento.value = data.data
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  function createEmptyMovimento(): Movimento {
    return {
      company_id: '',
      date: getDate(),
      valor: 0,
      financial_category_id: '',
      supplier_id: '',
    }
  }

  function resetMovimento() {
    movimento.value = createEmptyMovimento()
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
    loading,
    items,
    findById,
    fetchData,
    storeData,
    updateData,
    fechCompanyGroupData,
    fechCompanyData,
    fetchCategory,
    resetMovimento,
    movimento,
    criteria,
    resetCriteria,
  }
})
