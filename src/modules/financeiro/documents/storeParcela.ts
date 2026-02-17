import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/requestHelper'
import type { Column } from '@/components/common/AppTable.vue'
import type {
  MovimentoFinanceiro,
  Parcela,
  SearchDocument,
  Document,
  Supplier,
  Company,
} from './types'
import api from '@/services/api'
import type { ApiResponse } from '@/types/common'
import { toast } from 'vue-sonner'
import router from '@/router'

const normalizeDate = (date: any): string | null => {
  if (date === null || date === undefined) return null
  if (typeof date === 'string') return date.split('T')[0]
  if (date instanceof Date) return date.toISOString().split('T')[0]

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return null
  return dateObj.toISOString().split('T')[0]
}

export const useDocumentStore = defineStore('documents', () => {
  const loading = ref(false)
  const pendingDocuments = ref<Document[]>([])
  const parcela = ref<Parcela>({
    boleto: '',
    fatura: '',
    data_vencimento: '',
    valor_parcela: 0,
  })
  const searchDocument = ref<SearchDocument>(createEmptySearchDocument())
  const movimento = ref<MovimentoFinanceiro>(createEmptyDocument())
  const parcelas = ref<Parcela[]>([])
  const documentColumns = ref<Column[]>([
    {
      key: 'chave_nfe',
      label: 'Chave',
    },
    {
      key: 'supplier.name',
      label: 'Fornecedor',
    },
    {
      key: 'supplier.id_fiscal',
      label: 'ID Fiscal',
    },
    {
      key: 'num_document',
      label: 'NF',
    },
    {
      key: 'data_emissao',
      label: 'Emissão',
    },
    {
      key: 'val_document',
      label: 'Valor',
      align: 'right',
    },
  ])
  const activePart = ref<string>('search')

  async function fetchCondition() {
    return await api.get<ApiResponse<any[]>>(`/api/util/financeiro/payment_condition/search`)
  }

  async function fetchCategory() {
    return await api.get<ApiResponse<any[]>>(`/api/util/financial_category/analytics`)
  }

  const totalSelectedValue = computed(() => {
    const total = movimento.value.documents.reduce(
      (total, doc) => total + Number(doc.val_document ?? 0),
      0,
    )

    return Number(total.toFixed(2))
  })

  function validDataEmissao(document: Document): boolean {
    const first = normalizeDate(document.data_emissao)

    if (movimento.value.documents.length == 0) {
      movimento.value.data_emissao = first
      return true
    }

    for (let i = 0; i < movimento.value.documents.length; i++) {
      if (normalizeDate(movimento.value.documents[i].data_emissao) !== first) return false
    }
    return true
  }

  const totalParcelasValue = computed(
    () => movimento.value.parcelas?.reduce((total, doc) => total + (doc.valor_parcela ?? 0), 0),
    //parcelas.value.reduce((total, doc) => total + (doc.valor_parcela ?? 0), 0),
  )

  async function getPendingDocuments() {
    const data = await request<Document[]>({
      method: 'post',
      url: `/api/financeiro/documents`,
      payload: searchDocument.value,
      loading,
    })

    pendingDocuments.value = data

    if (pendingDocuments.value.length > 0) {
      activePart.value = 'select'

      movimento.value = createEmptyDocument()
      movimento.value.company_id = searchDocument.value.company_id
      movimento.value.company = searchDocument.value.company as Company
      movimento.value.supplier_id = searchDocument.value.supplier_id
      movimento.value.supplier = searchDocument.value.supplier as Supplier
    } else {
      toast('Não foram encontrado documentos pendentes')
    }
  }

  function createEmptyDocument(): MovimentoFinanceiro {
    return {
      supplier_id: null,
      data_entrada: null,
      data_emissao: null,
      company_id: null,
      payment_condition_id: null,
      financial_category_id: null,
      documents: [],
      parcelas: [],
    }
  }

  function createEmptySearchDocument(): SearchDocument {
    return {
      company_id: null,
      company: null,
      supplier_id: null,
      supplier: null,
    }
  }

  function resetDocumentFinanceiro() {
    movimento.value = createEmptyDocument()
  }

  function resetSearchDocumento() {
    searchDocument.value = createEmptySearchDocument()
  }

  function setParcelas() {
    if (!movimento.value.payment_condition?.condition) return

    movimento.value.parcelas = []

    // Ex: "30/60/90" → [30, 60, 90]
    const dias = movimento.value.payment_condition.condition
      .split('/')
      .map((d) => Number(d.trim()))
      .filter((d) => !isNaN(d))

    if (!dias.length) return

    const valorParcela = Number((totalSelectedValue.value / dias.length).toFixed(2))

    dias.forEach((dia, index) => {
      const vencimento = new Date(movimento.value.data_entrada)
      vencimento.setDate(vencimento.getDate() + dia)

      movimento.value.parcelas.push({
        fatura: `Parcela-${index + 1}/${dias.length}`,
        boleto: '',
        data_vencimento: vencimento.toISOString().split('T')[0],
        valor_parcela: valorParcela,
      })
    })
  }

  async function storeDocument() {
    try {
      const data = await request<MovimentoFinanceiro>({
        method: 'post',
        url: '/api/financeiro/documents/store',
        payload: movimento.value,
        successMessage: 'Movimento Criado com Sucesso',
        loading,
      })

      movimento.value = createEmptyDocument()
      router.push('/financeiro/documents')
    } catch (error: any) {}
  }

  return {
    storeDocument,
    setParcelas,
    totalSelectedValue,
    documentColumns,
    loading,
    pendingDocuments,
    getPendingDocuments,
    parcela,
    parcelas,
    totalParcelasValue,
    resetDocumentFinanceiro,
    movimento,
    fetchCondition,
    fetchCategory,
    resetSearchDocumento,
    searchDocument,
    activePart,
    validDataEmissao,
  }
})
