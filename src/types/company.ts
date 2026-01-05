export interface Company {
  id?: string | null
  name: string | null
  email: string | null
  phone: string | null
  type_person: string | null
  active: string | null
  principal: string | null
  id_fiscal: string | null
  endereco: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  id_ibge: string | null
  created_by: string | null
  updated_by: string | null
}

export function createEmptyCompany(): Company {
  return {
    id: null,
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
    created_by: null,
    updated_by: null,
  }
}
