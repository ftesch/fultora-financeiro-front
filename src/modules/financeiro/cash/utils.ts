import type { Criteria } from './types'

export function getParams(criteria: Criteria) {
  const params = new URLSearchParams()

  if (criteria.company_id) {
    params.append('company_id', criteria.company_id)
  }

  if (criteria.start_date) {
    params.append('start_date', criteria.start_date)
  }

  if (criteria.end_date) {
    params.append('end_date', criteria.end_date)
  }

  if (criteria.supplier_id) {
    params.append('supplier_id', criteria.supplier_id)
  }

  if (criteria.financial_category_id) {
    params.append('financial_category_id', criteria.financial_category_id)
  }

  if (criteria.per_page) {
    params.append('per_page', String(criteria.per_page))
  }

  if (criteria.page) {
    params.append('page', String(criteria.page))
  }

  return params
}

export function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
