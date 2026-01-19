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
