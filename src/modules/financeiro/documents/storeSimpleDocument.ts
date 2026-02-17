import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { request } from '@/utils/requestHelper'
import type { Column } from '@/components/common/AppTable.vue'
import type { SimpleDocument } from './types'
import api from '@/services/api'
import type { ApiResponse } from '@/types/common'

export const useSimpleDocumentStore = defineStore('siompleDocuments', () => {
  const loading = ref(false)
  const simpleDocument = ref<SimpleDocument>(createEmptyItem())

  const simpleDocumentColumns = ref<Column[]>([
    {
      key: 'num_document',
      label: 'Documento',
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
      key: 'data_entrada',
      label: 'Entrada',
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

  function createEmptyItem(): SimpleDocument {
    return {
      num_document: '',
      supplier_id: '',
      data_emissao: '',
      data_entrada: '',
      val_document: 0,
      status: 'pending',
      file: null,
      company_id: null,
    }
  }

  function resetItem() {
    simpleDocument.value = createEmptyItem()
  }

  async function fechCompanyData() {
    return await api.get<ApiResponse<any[]>>(`/api/util/company/partner`)
  }

  async function fechCompanyGroupData() {
    return await api.get<ApiResponse<any[]>>(`/api/util/company/group`)
  }

  async function storeSimpleDocument() {
    const data = await request<SimpleDocument>({
      method: 'post',
      url: '/api/financeiro/documents/simple_document',
      payload: simpleDocument.value,
      successMessage: 'Registro criado',
      loading,
      multipart: true,
    })
  }

  return {
    storeSimpleDocument,
    loading,
    simpleDocument,
    simpleDocumentColumns,
    resetItem,
    fechCompanyData,
    fechCompanyGroupData,
  }
})
