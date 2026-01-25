export interface Created {
  created_at: string
  name: string
}

export interface Updated {
  updated_at: string
  name: string
}

export interface Account {
  id: string
  type: string
  banco: string | null
  agencia: string | null
  conta: string | null
  digito_conta: string | null
  principal: boolean
  active: boolean
}

export interface Group {
  id: string
  codigo: string
  apelido: string
}

export interface Company {
  id?: number
  name: string
  email: string
  phone: string
  type_person: string
  type_entity: string
  active: boolean
  id_fiscal: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  id_ibge: number
  created?: Created
  updated?: Updated
  accounts?: Account[]
  group?: Group
}

export enum TypeEntity {
  Partner = 'partner',
  BusinessGroup = 'business_group',
  Employee = 'employee',
  Licensor = 'licensor',
}

export const TypeEntityLabel: Record<TypeEntity, string> = {
  [TypeEntity.BusinessGroup]: 'Grupo Empresarial',
  [TypeEntity.Employee]: 'Colaborador',
  [TypeEntity.Partner]: 'Fornecedor/Cliente',
  [TypeEntity.Licensor]: 'Licenciamento',
}

export function getTypeEntityLabel(value?: TypeEntity | string | null): string {
  if (!value) return ''

  return TypeEntityLabel[value as TypeEntity] ?? value
}

export interface CompanyPlan {
  id?: string
  plan_id: string
  active: number
  quantity: number
  created?: Created
  module: null | Module
  users_limit: number
  companies_limit: number
}

export interface CompanyUser {
  id?: string
  active: number
  created?: Created
  module: null | Module
  user: null | User
  user_id: string
  role: string
}

export interface Module {
  value: string
  label: string
}

export interface User {
  value: string
  label: string
}
