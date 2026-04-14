import { CircleDollarSign, DollarSign, Form, Store } from 'lucide-vue-next'

export const Modules = [
  {
    name: 'Marketplace',
    label: 'Marketplace',
    value: 'marketplace',
    description: 'Modulo para gestão das funcionalidades do marketplace',
    role: 'admin',
    route: '/app/marketplace',
    icon: Store,
  },
  {
    name: 'Dados Mestre',
    label: 'Dados Mestre',
    value: 'dados_mestre',
    description: 'Modulo para gestão de Dados Mestre',
    role: 'admin',
    route: '/master',
    icon: Form,
  },
  {
    name: 'Financeiro Central',
    label: 'Financeiro Central',
    value: 'central',
    description: 'Modulo para gestão financeira centralizada',
    role: 'admin',
    route: '/central',
    icon: CircleDollarSign,
  },
  {
    name: 'Financeiro Loja',
    label: 'Financeiro Loja',
    value: 'financeiro',
    description: 'Modulo para entrada de documentos e caixa',
    role: 'admin',
    route: '/financeiro',
    icon: DollarSign,
  },
] as const

export type ModuleValue = (typeof Modules)[number]['value']

export const MODULE_ROUTES: Record<ModuleValue, string> = {
  marketplace: '/app/marketplace',
  dados_mestre: '/master',
  central: '/central',
  financeiro: '/financeiro',
}
