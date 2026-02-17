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
  multipart?: boolean
}

function buildFormData(payload: any): FormData {
  const formData = new FormData()

  Object.entries(payload ?? {}).forEach(([key, value]) => {
    if (value === null || value === undefined) return

    // Múltiplos arquivos
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(`${key}[]`, item)
        } else {
          formData.append(`${key}[]`, String(item))
        }
      })
      return
    }

    // Arquivo único
    if (value instanceof File) {
      formData.append(key, value)
      return
    }

    // Objetos simples (JSON)
    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
      return
    }

    // Primitivos
    formData.append(key, String(value))
  })

  return formData
}

export async function request<T>({
  method,
  url,
  payload,
  successMessage,
  loading,
  multipart = false,
}: RequestOptions<T>): Promise<T> {
  loading.value = true

  try {
    let body = payload
    let headers: Record<string, string> | undefined

    if (multipart && payload) {
      body = buildFormData(payload)
      headers = {
        'Content-Type': 'multipart/form-data',
      }
    }

    const { data } = await api[method]<ApiResponse<T>>(url, body, {
      headers,
    })

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
