export interface PosSale {
  id?: string
  date: string
  company_id: string
  company?: Company
  open_balance?: number
  close_balance?: number
  transactions: Transaction[]
}

export interface Transaction {
  id?: string
  sales_payment_method_id: string
  payment_method: PaymentMethod
  valor: number
}

export interface Company {
  id: string
  name: string
  id_fiscal: string
}

export interface PaymentMethod {
  id: string
  order: number
  payment_method: string
  category_id: string
  category: Category
}

export interface Category {
  id: string
  name: string
  account: string
  type: string
}

export interface Criteria {
  company_id: string
  company?: Company
  start_date: string
  end_date: string
  per_page: number
  page: number
}
