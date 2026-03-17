import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Agenda } from './types'
import type { ApiResponse } from '@/types/common'
import api from '@/services/api'
import { handleError } from '@/utils/helpers'

const APIRoute = '/api/central/agenda'

export const useAgendaStore = defineStore('agenda', () => {
  const loading = ref(false)
  const items = ref<Agenda[]>([])
  const item = ref<Agenda | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<Agenda[]>>(`${APIRoute}`)

      items.value = data.data
    } catch (error: any) {
      handleError(error?.response)
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

  return {
    loading,
    items,
    item,
    findById,
    fetchData,
  }
})
