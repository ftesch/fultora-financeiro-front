import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Company, CompanyPlan, CompanyUser, Group } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { request } from '@/utils/requestHelper'
import {
  createEmptyCompany,
  createEmptyGroup,
  createEmptyPlan,
  createEmptyUser,
} from './store/company.factory'

export const useCompanyStore = defineStore('company', () => {
  const loading = ref(false)
  const items = ref<Company[]>([])
  const companyPlans = ref<CompanyPlan[]>([])
  const companyUsers = ref<CompanyUser[]>([])
  const item = ref<Company | null>(null)
  const companyPlan = ref<CompanyPlan>(createEmptyPlan())
  const companyUser = ref<CompanyUser>(createEmptyUser())

  async function fetchData() {
    const data = await request<Company[]>({
      method: 'get',
      url: '/api/master/company',
      loading,
    })

    items.value = data
  }

  async function fetchCompanyPlansData() {
    if (!item.value?.id) {
      return
    }

    const data = await request<CompanyPlan[]>({
      method: 'get',
      url: `/api/master/company_plans/${item.value?.id}`,
      loading,
    })
    companyPlans.value = data
  }

  async function fetchCompanyUserData() {
    if (!item.value?.id) {
      return
    }

    const data = await request<CompanyUser[]>({
      method: 'get',
      url: `/api/master/company_users/${item.value?.id}`,
      loading,
    })
    companyUsers.value = data
  }

  async function fetchUsers() {
    return await api.get<ApiResponse<any[]>>(`/api/util/users/search`)
  }

  async function storeData() {
    const data = await request<Company>({
      method: 'post',
      url: '/api/master/company',
      payload: item.value,
      successMessage: 'Registro criado',
      loading,
    })

    item.value = data
    items.value.push(data)
  }

  async function updateData() {
    const data = await request<Company>({
      method: 'put',
      url: `/api/master/company/${item.value?.id}`,
      payload: item.value,
      successMessage: 'Registro Atualizado',
      loading,
    })

    item.value = data
    items.value.push(data)

    loading.value = true
  }

  async function storeGroup() {
    const data = await request<Group>({
      method: 'put',
      url: `/api/master/group/${item.value?.group?.id}`,
      payload: item.value?.group,
      loading,
    })

    item.value.group = data
  }

  async function findById(id: string) {
    const found = items.value.find((item) => String(item.id) === String(id))

    if (found) {
      item.value = { ...found }
      return item.value
    }

    const data = await request<Company>({
      method: 'get',
      url: `/api/master/company/${id}`,
      loading,
    })

    item.value = data
    return item.value
  }

  function resetItem() {
    item.value = createEmptyCompany()
  }

  function resetGroup() {
    item.value.group = createEmptyGroup()
  }

  async function searchCEP() {
    const data = await request({
      method: 'get',
      url: `/api/util/cep?cep=${item?.value?.cep}`,
      loading,
    })

    item.value.endereco = data.endereco
    item.value.complemento = data.complemento
    item.value.bairro = data.bairro
    item.value.cidade = data.cidade
    item.value.estado = data.estado
    item.value.id_ibge = data.id_ibge
  }

  async function storePlan() {
    const data = await request<CompanyPlan[]>({
      method: 'post',
      url: `/api/master/company_plans/${item.value?.id}`,
      payload: companyPlan.value,
      loading,
    })

    companyPlans.value = data
  }

  async function storeUser() {
    const data = await request<CompanyUser[]>({
      method: 'post',
      url: `/api/master/company_users/${item.value?.id}`,
      payload: companyUser.value,
      loading,
    })

    companyUsers.value = data
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
    searchCEP,
    storeGroup,
    fetchCompanyPlansData,
    fetchCompanyUserData,
    companyPlans,
    companyPlan,
    companyUsers,
    companyUser,
    storePlan,
    storeUser,
    fetchUsers,
  }
})
