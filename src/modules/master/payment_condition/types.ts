export interface PaymentCondition {
  id?: string
  title: string
  is_boleto: number
  active: number
  condition: string
  start_in: string
  created: Created | null
  updated: Updated | null
}

export interface Created {
  name: string
  created_at: string
}

export interface Updated {
  name: string
  updated_at: string
}

export enum StartIn {
  ONENTRANCE = 'entrance',
  ONEMISSION = 'emission',
  ONCREATE = 'create',
}

export const StartInLabel: Record<StartIn, string> = {
  [StartIn.ONCREATE]: 'Lançamento',
  [StartIn.ONEMISSION]: 'Emissão',
  [StartIn.ONENTRANCE]: 'Entrada',
}

export function getStartInLabel(value?: StartIn | string | null): string {
  if (!value) return ''

  return StartInLabel[value as StartIn] ?? value
}

export const StartInColor: Record<StartIn, string> = {
  [StartIn.ONCREATE]: 'bg-emerald-100 text-emerald-700',
  [StartIn.ONEMISSION]: 'bg-sky-100 text-sky-700',
  [StartIn.ONENTRANCE]: 'bg-amber-100 text-amber-700',
}

export function getStartInColor(value?: StartIn | string | null): string {
  if (!value) return ''

  return StartInColor[value as StartIn] ?? value
}
