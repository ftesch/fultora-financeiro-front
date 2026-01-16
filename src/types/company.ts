export interface Licensor {
  id?: string
  name: string
  email: string
  phone: string
  type_person: string
  active?: string
  principal?: string
  id_fiscal: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  id_ibge: string
  created_by: string
  updated_by?: string
}

export function createEmptyCompany(): Licensor {
  return {
    name: '',
    email: '',
    phone: '',
    type_person: '',
    active: '1',
    principal: '0',
    id_fiscal: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    id_ibge: '',
    created_by: '',
  }
}
