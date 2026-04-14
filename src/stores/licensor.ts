import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createEmptyCompany, type Licensor } from '@/types/company'
import { handleError } from '@/utils/helpers'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { useAuthStore } from './auth'
import { toast } from 'vue-sonner'

export const useLicensorStore = defineStore('licensor', () => {
  const licensor = ref<Licensor>(createEmptyCompany())
  const loading = ref<boolean>(false)
  const hasPrincipalCompany = computed(() => !!licensor.value?.name)

  async function storeCompany() {
    loading.value = false

    try {
      const { data } = await api.post<ApiResponse<Licensor>>('/api/company', licensor.value)

      licensor.value = data.data

      const { setLicensor } = useAuthStore()

      setLicensor({
        name: licensor?.value?.name,
        id_fiscal: licensor?.value?.id_fiscal,
        plans: [],
      })
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  async function setLicensor(payload: Licensor) {
    licensor.value = payload
  }

  async function fetchPrincipalCompany() {
    loading.value = false
    
    try {
      const { data } = await api.get<ApiResponse<Licensor>>('/api/company/principal')
      
      licensor.value = data.data      

      const { setLicensor } = useAuthStore()
      setLicensor({
        name: licensor.value.name,
        id_fiscal: licensor.value.id_fiscal,
        plans: [],
      })
    } catch (error: any) {
    } finally {

      loading.value = false
    }
  }

  function resetCompany() {
    licensor.value = createEmptyCompany()
  }

  async function searchCEP() {
    loading.value = false

    try {
      const { data } = await api.get(`/api/util/cep?cep=${licensor.value.cep}`)
      const endereco = data.data

      licensor.value.endereco = endereco.endereco
      licensor.value.complemento = endereco.complemento
      licensor.value.bairro = endereco.bairro
      licensor.value.cidade = endereco.cidade
      licensor.value.estado = endereco.estado
      licensor.value.id_ibge = endereco.id_ibge
    } catch (error: any) {
      handleError(error?.response)
    } finally {
      loading.value = false
    }
  }

  return {
    licensor,
    storeCompany,
    resetCompany,
    loading,
    fetchPrincipalCompany,
    hasPrincipalCompany,
    searchCEP,
    setLicensor,
  }
})
