export interface Supplier {
  id: string
  name: string
  id_fiscal: string
}

export interface Company {
  id: string
  name: string
  id_fiscal: string
}

export interface Document {
  id: string
  supplier_id: string
  chave_nfe: string
  data_emissao: string
  status: string
  supplier: Supplier
  num_document: string
  val_document: number
}

export interface Parcela {
  fatura: string
  boleto: string
  data_vencimento: string
  valor_parcela: number
}

export interface PaymentCondition {
  id: string
  title: string
  condition: string
  is_boleto: number
  start_in: string
}

export interface FinancialCategory {
  id: string
  account: string
  name: string
}

export interface SimpleDocument {
  supplier_id: string
  supplier?: Supplier
  data_entrada: string
  data_emissao: string
  num_document: string
  val_document: number
  status: string
  company_id: string | null
  company?: Company
  file: File | null
}

export interface MovimentoFinanceiro {
  company_id: string | null
  company?: Company
  payment_condition_id: string | null
  payment_condition?: PaymentCondition
  financial_category_id: string | null
  financial_category?: FinancialCategory
  supplier_id: string | null
  supplier?: Supplier
  data_emissao: string | null
  data_entrada: string | null
  documents: Document[]
  parcelas: Parcela[]
}

export interface SearchDocument {
  company_id: null | string
  company: null | Company
  supplier_id: null | string
  supplier: null | Supplier
}
