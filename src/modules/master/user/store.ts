import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from './types'
import api from '@/services/api'
import type { ApiResponse } from '@/types/common'
import { handleError } from '@/utils/helpers'
import { toast } from 'vue-sonner'

export const useUserStore = defineStore('user', () => {
  const loading = ref(false)
  const items = ref<User[]>([])
  const item = ref<User | null>(null)

  async function fetchData() {
    loading.value = true

    try {
      const { data } = await api.get<ApiResponse<User[]>>('/api/master/user')

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
      const { data } = await api.post<ApiResponse<User>>('/api/master/user', item.value)

      item.value = data.data
      items.value.push(data.data)

      toast.success(data.message ?? 'Usuario Criado')
      return data.data
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateData() {
    if (!item.value?.id) return

    loading.value = true

    try {
      const { data } = await api.put<ApiResponse<User>>(
        `/api/master/user/${item.value?.id}`,
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

      console.log(found)

      if (found) {
        item.value = { ...found }
        return item.value
      }

      return null
    } catch (error: any) {
      handleError(error?.response)
      throw error
    } finally {
      loading.value = false
    }
  }

  function createEmptyItem(): User {
    return {
      name: '',
      email: '',
      created_at: '',
      updated_at: '',
    }
  }

  function resetItem() {
    item.value = createEmptyItem()
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
  }
})
