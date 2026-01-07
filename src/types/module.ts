import { Form, Store } from 'lucide-vue-next'

export const Modules = [
  {
    name: 'Marketplace',
    value: 'marketplace',
    description: 'Modulo para gestão das funcionalidades do marketplace',
    role: 'admin',
    route: '/app/marketplace',
    icon: Store,
  },
  {
    name: 'Dados Mestre',
    value: 'dados_mestre',
    description: 'Modulo para gestão de Dados Mestre',
    role: 'admin',
    route: '/master',
    icon: Form,
  },
] as const

export type ModuleValue = (typeof Modules)[number]['value']

export const MODULE_ROUTES: Record<ModuleValue, string> = {
  marketplace: '/app/marketplace',
  dados_mestre: '/master',
}
