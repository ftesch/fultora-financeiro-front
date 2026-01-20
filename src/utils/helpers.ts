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

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0,00'
  }

  const numberValue = typeof value === 'string' ? Number(value.replace(',', '.')) : value

  if (Number.isNaN(numberValue)) {
    return '0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue)
}

export function formatDateTimeBR(value: Date | string | number | null | undefined): string {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
