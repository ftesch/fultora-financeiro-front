import type { Company, CompanyPlan, CompanyUser, Group } from '../types'

export function createEmptyCompany(): Company {
  return {
    name: '',
    email: '',
    phone: '',
    type_person: '',
    active: true,
    id_fiscal: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    id_ibge: 0,
  } as Company
}

export function createEmptyGroup(): Group {
  return {
    id: '',
    codigo: '',
    apelido: '',
  }
}

export function createEmptyPlan(): CompanyPlan {
  return {
    plan_id: '',
    active: 1,
    quantity: 0,
    module: null,
  }
}

export function createEmptyUser(): CompanyUser {
  return {
    user_id: '',
    user: null,
    active: 1,
    module: null,
    role: 'user',
  }
}
