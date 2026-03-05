import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Criteria, PaymentOrder } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { getParams } from './utils'
import { request } from '@/utils/requestHelper'

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

  async function settlement() {
    loading.value = true

    try {
      const payload = {
        company_accound_id: item.value?.company_accound_id,
        data_pagamento: item.value?.data_pagamento,
        valor_pagamento: item.value?.valor_pagamento,
        comprovante: item.value?.comprovante,
      } as any

      const responseData = await request<PaymentOrder>({
        method: 'put',
        url: `${APIRoute}/${item.value?.id}/settlement`,
        payload: payload,
        successMessage: 'Registro criado',
        loading,
        multipart: true,
      })

      item.value = responseData
      toast.success('Baixa realizada')
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function downloadComprovante() {
    const comprovantePath = item.value?.path_comprovante

    if (!comprovantePath) {
      toast.error('Comprovante não disponível para download')
      return
    }

    loading.value = true

    try {
      const { data, headers } = await api.get<Blob>(`${APIRoute}/${item.value?.id}/comprovante`, {
        responseType: 'blob',
      })

      const filename = extractFilenameFromHeaders(headers['content-disposition'], comprovantePath)
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
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
      valor_pagamento: 0,
      fatura: '',
      path_comprovante: null,
      comprovante: null,
    }
  }

  function extractFilenameFromHeaders(contentDisposition?: string, fallbackPath?: string) {
    if (contentDisposition) {
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
      if (utf8Match?.[1]) {
        return decodeURIComponent(utf8Match[1])
      }

      const quotedMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i)
      if (quotedMatch?.[1]) {
        return quotedMatch[1]
      }
    }

    const pathName = fallbackPath?.split('/').pop()
    return pathName || 'comprovante'
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
    settlement,
    downloadComprovante,
    criteria,
    resetCriteria,
    fechCompanyGroupData,
    fechCompanyData,
    fetchCategory,
    fetchAccount,
  }
})
