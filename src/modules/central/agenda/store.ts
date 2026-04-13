import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Agenda, AgendaResponse, Company, Criteria, Document } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { format, getWeek } from 'date-fns';
import { request } from '@/utils/requestHelper'
import { toast } from 'vue-sonner'
import { SituacaoOP } from '../order/types'


const APIRoute = '/api/central/agenda'
const APIBaixa = '/api/central/payment_order'

export const useAgendaStore = defineStore('agenda', () => {
  const loading = ref(false)
  const items = ref<Agenda[]>([])
  const item = ref<Agenda | null>(null)
  const criteria = ref<Criteria>({
    company_id: '',
    semana: getWeek(new Date(), {
      weekStartsOn: 0 // domingo
    })
  })
  const documents = ref<Document[]>([])
  const documentOfPayment = ref<Document | null>(null)
  const company = ref<Company | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.post<ApiResponse<Agenda[]>>(`${APIRoute}`, {
        company_id: criteria.value.company_id,
        semana: criteria.value.semana
      })

      items.value = data.data
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  async function fetchDataAgenda(companyId: string, dataAgenda: string) {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<AgendaResponse>>(`${APIRoute}/${companyId}/${dataAgenda}`)

      documents.value = data.data.documents
      company.value = data.data.company
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  function setDocument(payload: Document | null) {
    documentOfPayment.value = payload
      ? {
          ...payload,
          company_account_id: payload.company_account_id ?? '',
          data_pagamento: payload.situacao_op == SituacaoOP.OPEN
            ? format(new Date(), 'yyyy-MM-dd')
            : payload.data_pagamento ?? '',
          valor_pagamento: payload.situacao_op == SituacaoOP.OPEN ? payload.valor_nominal : payload.valor_pagamento,
          comprovante: null,
        }
      : null
  }

  async function settlement() {
    if (!documentOfPayment.value?.id) return

    try {
      const payload = {
        company_account_id: documentOfPayment.value.company_account_id,
        data_pagamento: documentOfPayment.value.data_pagamento,
        valor_pagamento: documentOfPayment.value.valor_pagamento,
        comprovante: documentOfPayment.value.comprovante,
      }

      const responseData = await request<Document>({
        method: 'put',
        url: `${APIBaixa}/${documentOfPayment.value.id}/settlement`,
        payload,
        successMessage: 'Baixa realizada',
        loading,
        multipart: true,
      })

      documentOfPayment.value = {
        ...responseData,
        comprovante: null,
      }

      documents.value = documents.value.map((item) =>
        String(item.id) === String(responseData.id)
          ? {
              ...responseData,
              comprovante: null,
            }
          : item,
      )
    } catch (error: any) {
      throw error
    }
  }

  async function fetchAccount() {
    const companyId = company.value?.id

    if (!companyId) return []

    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/company_account?company_id=${companyId}`)
    return data.data
  }

  async function downloadComprovante() {
    const comprovantePath = documentOfPayment.value?.path_comprovante

    if (!documentOfPayment.value?.id || !comprovantePath) {
      toast.error('Comprovante não disponível para download')
      return
    }

    loading.value = true

    try {
      const { data, headers } = await api.get<Blob>(`${APIRoute}/${documentOfPayment.value.id}/comprovante`, {
        responseType: 'blob',
      })

      const filename = extractFilenameFromHeaders(headers['content-disposition'], comprovantePath)
      const url = window.URL.createObjectURL(data)
      const link = window.document.createElement('a')

      link.href = url
      link.download = filename
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
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
      const found = items.value.find((item) => String(item.id) === String(id))

      if (found) {
        item.value = { ...found }
        return item.value
      } else {
        const { data } = await api.get<ApiResponse<Agenda>>(`${APIRoute}/${id}`)
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

  async function fechCompanyGroupData() {
    const { data } = await api.get<ApiResponse<any[]>>(`/api/util/company/group`)
    return data.data
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


  return {
    loading,
    items,
    item,
    findById,
    fetchData,
    criteria,
    fechCompanyGroupData,
    fetchDataAgenda,
    documents,
    company,
    documentOfPayment,
    setDocument,
    settlement,
    fetchAccount,
    downloadComprovante,
  }
})
