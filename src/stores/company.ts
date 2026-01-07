import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createEmptyCompany, type Company } from '@/types/company'
import { handleError } from '@/utils/helpers'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useCompanyStore = defineStore('company', () => {
  const company = ref<Company>(createEmptyCompany())
  const loading = ref<boolean>(false)
  const hasPrincipalCompany = computed(() => !!company.value?.name)

  async function storeCompany() {
    loading.value = false

    try {
      const { data } = await api.post<ApiResponse<Company>>('/api/company', company.value)

      company.value = data.data

      const { setCompany } = useAuthStore()

      setCompany({
        name: company.value.name,
        id_fiscal: company.value.id_fiscal,
      })
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  async function setCompany(payload: Company) {
    company.value = payload
  }

  async function fetchPrincipalCompany() {
    loading.value = false

    try {
      const { data } = await api.get<ApiResponse<Company>>('/api/company/principal')

      company.value = data.data

      const { setCompany } = useAuthStore()
      setCompany({
        name: company.value.name,
        id_fiscal: company.value.id_fiscal,
      })
    } catch (error: any) {
    } finally {
      loading.value = false
    }
  }

  function resetCompany() {
    company.value = createEmptyCompany()
  }

  async function searchCEP() {
    loading.value = false

    try {
      const { data } = await api.get(`/api/util/cep?cep=${company.value.cep}`)
      const endereco = data.data

      company.value.endereco = endereco.endereco
      company.value.complemento = endereco.complemento
      company.value.bairro = endereco.bairro
      company.value.cidade = endereco.cidade
      company.value.estado = endereco.estado
      company.value.id_ibge = endereco.id_ibge
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  return {
    company,
    storeCompany,
    resetCompany,
    loading,
    fetchPrincipalCompany,
    hasPrincipalCompany,
    searchCEP,
    setCompany,
  }
})
