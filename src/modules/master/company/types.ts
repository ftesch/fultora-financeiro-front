export interface Created {
  created_at: string
  name: string
}

export interface Updated {
  created_at: string
  name: string
}

export interface Company {
  id?: number
  name: string
  email: string
  phone: string
  type_person: string
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
}
