import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Balance, Movimento } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const APIRoute = '/api/financeiro/cash'

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useCashStore = defineStore('cash', () => {
  const loading = ref(false)
  const items = ref<Balance[]>([])
  const item = ref<Balance | null>(null)
  const movimento = ref<Movimento>(createEmptyMovimento())

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<Balance[]>>(`${APIRoute}`)

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
      const { data } = await api.put<ApiResponse<Balance>>(
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
        const { data } = await api.get<ApiResponse<Balance>>(`${APIRoute}/${id}`)
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

  function createEmptyItem(): Balance {
    return {
      company_id: '',
      date: '',
      open_balance: 0,
      close_balance: 0,
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

  function resetItem() {
    item.value = createEmptyItem()
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
    fechCompanyData,
    fetchCategory,
    resetMovimento,
    movimento,
  }
})
