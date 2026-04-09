import type { Criteria } from './types'

export function getParams(criteria: Criteria) {
  const params = new URLSearchParams()

  if (criteria.per_page) {
    params.append('per_page', String(criteria.per_page))
  }

  if (criteria.page) {
    params.append('page', String(criteria.page))
  }

  return params
}
