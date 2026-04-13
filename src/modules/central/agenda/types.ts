export interface Agenda {
  id?: number | string
  data: string
  valor_apagar: number
  valor_atrasado: number
  valor_pago: number
}



export interface Company {
  id: string
  name: string
  id_fiscal: string
}

export interface Supplier {
  name: string
  id_fiscal: string
}


export interface Criteria {
  company_id: string
  company?: Company
  semana: number
}

export interface FinancialCategory {
  account: string
  name: string
  type: string
}

export interface CompanyAccount {
  [key: string]: any
  id: string
  banco: string | number
  agencia: string | number
  conta: string
  type?: string
}

export interface Document {
  id: string
  op: string
  fatura: string
  situacao_op: string
  data_emissao: string
  data_venciamento?: string
  data_vencimento?: string
  data_entrada: string
  data_pagamento: string
  supplier_id: string
  supplier: Supplier
  financial_category_id: string
  financial_category: FinancialCategory
  company_account_id: string | null
  account?: CompanyAccount
  valor_nominal: number
  valor_juros: number
  valor_desconto: number
  valor_liquido: number
  valor_pagamento: number
  boleto: string
  path_comprovante?: string | null
  comprovante: File | null
}

export interface AgendaResponse {
  company: Company
  documents: Document[]
}
