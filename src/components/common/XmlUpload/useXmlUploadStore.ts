import api from '@/services/api'
import { defineStore } from 'pinia'

interface UploadState {
  loading: boolean
  error: string | null
  response: any | null
}

export const useXmlUploadStore = defineStore('xmlUpload', {
  state: (): UploadState => ({
    loading: false,
    error: null,
    response: null,
  }),

  actions: {
    async uploadXmlFiles(action: string, files: File[]) {
      this.loading = true
      this.error = null
      this.response = null

      try {
        const formData = new FormData()

        files.forEach((file) => {
          formData.append('files[]', file)
        })

        const { data } = await api.post(action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.response = data
        return data
      } catch (err: any) {
        this.error = err?.response?.data?.message ?? 'Erro ao enviar os arquivos XML.'
        throw err
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.loading = false
      this.error = null
      this.response = null
    },
  },
})
