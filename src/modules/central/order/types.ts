export interface PaymentOrderDocumentLink {
  document: FiscalDocument
}

export interface PaymentOrder {
  id?: string
  op?: string
  fatura: string
  situacao_op: string
  company_id: string
  company?: Company
  supplier_id: string
  supplier?: Supplier
  financial_category_id: string
  financial_category?: FinancialCategory
  company_account_id: string
  account?: Account
  documents?: PaymentOrderDocumentLink[]
  data_emissao: string
  data_entrada: string
  data_vencimento: string
  data_pagamento: string
  valor_nominal: number
  valor_juros: number
  valor_desconto: number
  valor_liquido: number
  valor_pagamento: number
  boleto?: string | null
  path_comprovante?: string | null
  created?: Created
  updated?: Updated
  comprovante: File | null
}

export interface FiscalDocument {
  num_document: string
  data_emissao: string
  val_document: number
}

export interface Created {
  created_at: string
  created_by: string
}

export interface Updated {
  updated_at: string
  updated_by: string
}

export interface Company {
  id: string
  name: string
  id_fiscal: string
}

export interface Supplier {
  id: string
  name: string
  id_fiscal: string
}

export interface FinancialCategory {
  id: string
  account: string
  name: string
  type: string
}

export interface Account {
  id?: string
  banco: number
  agencia: number
  conta: string
  tipo: string // caixa ou bancária
}

export interface Criteria {
  company_id: string
  company?: Company
  supplier_id: string
  supplier?: Supplier
  financial_category_id: string
  financial_category?: FinancialCategory
  start_date: string
  end_date?: string
  data_entrada?: { start?: string, end?: string }
  data_vencimento?: { start?: string, end?: string }
  data_lancamento?: { start?: string, end?: string }
  data_pagamento?: { start?: string, end?: string }
  per_page: number
  page: number
}

export enum SituacaoOP {
  OPEN = 'open',
  PAID = 'paid',
  PROCESSING = 'processing',
}

export const SituacaoOPLabel: Record<SituacaoOP, string> = {
  [SituacaoOP.OPEN]: 'Aberta',
  [SituacaoOP.PAID]: 'Pago',
  [SituacaoOP.PROCESSING]: 'Em Processamento',
}

export const SituacaoOPColor: Record<SituacaoOP, string> = {
  [SituacaoOP.OPEN]: 'bg-emerald-100 text-emerald-700',
  [SituacaoOP.PAID]: 'bg-sky-100 text-sky-700',
  [SituacaoOP.PROCESSING]: 'bg-amber-100 text-amber-700',
}

export function getSituacaoOPLabel(value?: SituacaoOP | string | null): string {
  if (!value) return ''

  return SituacaoOPLabel[value as SituacaoOP] ?? value
}

export function getSituacaoOPColor(value?: SituacaoOP | string | null): string {
  if (!value) return ''

  return SituacaoOPColor[value as SituacaoOP] ?? value
}
