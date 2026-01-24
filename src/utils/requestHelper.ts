import api from '@/services/api'
import { toast } from 'vue-sonner'
import { handleError } from '@/utils/helpers'
import type { ApiResponse } from '@/types/common'

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

interface RequestOptions<T> {
  method: HttpMethod
  url: string
  payload?: any
  successMessage?: string
  loading: { value: boolean }
}

export async function request<T>({
  method,
  url,
  payload,
  successMessage,
  loading,
}: RequestOptions<T>): Promise<T> {
  loading.value = true

  try {
    const { data } = await api[method]<ApiResponse<T>>(url, payload)

    if (successMessage) {
      toast.success(data.message ?? successMessage)
    }

    return data.data
  } catch (error: any) {
    handleError(error?.response)
    throw error
  } finally {
    loading.value = false
  }
}
