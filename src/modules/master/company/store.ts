import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Company, CompanyPlan, Group } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

export const useCompanyStore = defineStore('company', () => {
  const loading = ref(false)
  const items = ref<Company[]>([])
  const companyPlans = ref<CompanyPlan[]>([])
  const item = ref<Company | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<Company[]>>('/api/master/company')

      items.value = data.data
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyPlansData() {
    if (!item.value?.id) {
      return
    }
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<CompanyPlan[]>>(
        `/api/master/company_plans/${item.value?.id}`,
      )

      companyPlans.value = data.data
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  async function storeData() {
    loading.value = true

    try {
      const { data } = await api.post<ApiResponse<Company>>('/api/master/company', item.value)

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
      const { data } = await api.put<ApiResponse<Company>>(
        `/api/master/company/${item.value?.id}`,
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

  async function storeGroup() {
    loading.value = true

    try {
      const { data } = await api.put<ApiResponse<Group>>(
        `/api/master/group/${item.value?.group?.id}`,
        item.value?.group,
      )

      item.value.group = data.data
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
        const { data } = await api.get<ApiResponse<Company>>(`/api/master/company/${id}`)
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

  function createEmptyItem(): Company {
    return {
      name: '',
      email: '',
      phone: '',
      type_person: '',
      active: true,
      id_fiscal: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      id_ibge: 0,
    } as Company
  }

  function resetItem() {
    item.value = createEmptyItem()
  }

  function resetGroup() {
    item.value.group = {
      id: '',
      codigo: '',
      apelido: '',
    } as Group
  }

  async function searchCEP() {
    loading.value = false

    try {
      const { data } = await api.get(`/api/util/cep?cep=${item?.value?.cep}`)
      const endereco = data.data

      item.value.endereco = endereco.endereco
      item.value.complemento = endereco.complemento
      item.value.bairro = endereco.bairro
      item.value.cidade = endereco.cidade
      item.value.estado = endereco.estado
      item.value.id_ibge = endereco.id_ibge
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  return {
    resetItem,
    resetGroup,
    loading,
    items,
    item,
    findById,
    fetchData,
    storeData,
    updateData,
    createEmptyItem,
    searchCEP,
    storeGroup,
    fetchCompanyPlansData,
    companyPlans,
  }
})
