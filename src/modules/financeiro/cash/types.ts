export interface Balance {
  id?: string
  company_id: string
  company?: Company
  date: string
  open_balance: number
  close_balance: number
}
export interface Movimento {
  id?: string
  company_id: string
  company?: Company
  date: string
  supplier_id: string
  supplier?: Supplier
  valor: number
  financial_category_id: string
  financial_category?: FinancialCategory
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
