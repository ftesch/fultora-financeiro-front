import { toast } from 'vue-sonner'

export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
  })
}

export const handleError = (response: any | null) => {
  const status = response?.status

  // 422 - Credenciais inválidas / validação
  if (status === 422 || status === 401) {
    const message = response?.data?.message ?? 'Credenciais inválidas'

    showErrorToast('Falha no login', message)
  }

  // 500 - Erro inesperado
  else if (status >= 500) {
    showErrorToast('Erro interno', 'Ocorreu um erro inesperado. Tente novamente mais tarde.')
  }

  // fallback
  else {
    showErrorToast('Erro', 'Houve uma falha geral.')
  }
}
