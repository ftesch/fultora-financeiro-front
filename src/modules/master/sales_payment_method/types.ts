export interface SalesPaymentMethod {
  id?: number
  order: string
  category_id: string
  category?: Category
  acquirer_id: string | null
  acquirer?: Acquirer
  payment_method: string
  payment_term_options: string
  payment_term_days: number
  payment_tax: number
  active: number
  created?: Created
  updated?: Updated
}

export interface Category {
  account: string
  name: string
  type: string
}

export interface Acquirer {
  name: string
  id_fiscal: string
}

export interface Created {
  created_at: string
  name: string
}

export interface Updated {
  updated_at: string
  name: string
}

export enum PaymentMethod {
  Dinheiro = 'dinheiro',
  CartaoDebito = 'cartao_debito',
  CartaoCredito = 'cartao_credito',
  CarteiraDigital = 'carteira_digital',
  Pix = 'pix',
  Boleto = 'boleto',
  Devolucao = 'devolucao',
  Convenio = 'convenio',
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.Dinheiro]: 'Dinheiro',
  [PaymentMethod.CartaoCredito]: 'Cartão de Credito',
  [PaymentMethod.CartaoDebito]: 'Cartão de Debito',
  [PaymentMethod.CarteiraDigital]: 'Carteira Digital',
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Boleto]: 'Boleto',
  [PaymentMethod.Devolucao]: 'Devolução',
  [PaymentMethod.Convenio]: 'Convênio',
}

export const PaymentMethodColor: Record<PaymentMethod, string> = {
  [PaymentMethod.Dinheiro]: 'bg-emerald-100 text-emerald-700',
  [PaymentMethod.CartaoCredito]: 'bg-blue-100 text-blue-700',
  [PaymentMethod.CartaoDebito]: 'bg-sky-100 text-sky-700',
  [PaymentMethod.CarteiraDigital]: 'bg-violet-100 text-violet-700',
  [PaymentMethod.Pix]: 'bg-green-100 text-green-700',
  [PaymentMethod.Boleto]: 'bg-amber-100 text-amber-700',
  [PaymentMethod.Devolucao]: 'bg-red-100 text-red-700',
  [PaymentMethod.Convenio]: 'bg-indigo-100 text-indigo-700',
}

export function getPaymentMethodLabel(value?: PaymentMethod | string | null): string {
  if (!value) return ''

  return PaymentMethodLabel[value as PaymentMethod] ?? value
}
export function getPaymentMethodColor(value?: PaymentMethod | string | null): string {
  if (!value) return ''

  return PaymentMethodColor[value as PaymentMethod] ?? value
}
