export interface Plans {
  id: string
  active: boolean
  companies_limit: number
  users_limit: number
  price: string
  plan_id: string
}

export interface Modules {
  id: string
  module: string
  name: string
  description: string
  plans: Plans[]
  quantity?: number
}

export interface PurchasePlan extends Plans {
  module: string
  quantity: number
}
