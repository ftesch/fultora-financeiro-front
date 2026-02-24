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
  op?: string
  company_id: string
  company?: Company
  date: string
  supplier_id: string
  supplier?: Supplier
  financial_category_id: string
  financial_category?: FinancialCategory
  valor: number
  created?: Created
  updated?: Updated
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

export interface Criteria {
  company_id: string
  company?: Company
  supplier_id: string
  supplier?: Supplier
  financial_category_id: string
  financial_category?: FinancialCategory
  start_date: string
  end_date: string
  per_page: number
  page: number
}
