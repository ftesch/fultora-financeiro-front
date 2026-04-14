export interface FinancialCategory {
  id?: number
  account: string
  level: number
  name: string
  type: string
  financial_category_id: string | null
  financial_parent: FinancialCategory | null
  created?: Created
  updated?: Updated
}

export interface Created {
  created_at: string
  name: string
}

export interface Updated {
  updated_at: string
  name: string
}

export enum FinancialCategoryType {
  Sintetica = 'S',
  Credora = 'C',
  Devedora = 'D',
}

export const FinancialCategoryTypeLabel: Record<FinancialCategoryType, string> = {
  [FinancialCategoryType.Sintetica]: 'Sintética',
  [FinancialCategoryType.Credora]: 'Credora',
  [FinancialCategoryType.Devedora]: 'Devedora',
}

export const FinancialCategoryTypeLabelVariant: Record<
  FinancialCategoryType,
  BadgeVariants['variant']
> = {
  [FinancialCategoryType.Sintetica]: 'outline',
  [FinancialCategoryType.Credora]: 'secondary',
  [FinancialCategoryType.Devedora]: 'destructive',
}

export function getFinancialCategoryTypeLabel(
  value?: FinancialCategoryType | string | null,
): string {
  if (!value) return ''

  return FinancialCategoryTypeLabel[value as FinancialCategoryType] ?? value
}

export function getFinancialCategoryTypeVariant(
  value?: FinancialCategoryType | string | null,
): BadgeVariants['variant'] {
  if (!value) return 'default'

  return FinancialCategoryTypeLabelVariant[value as FinancialCategoryType] ?? 'default'
}
import type { BadgeVariants } from '@/components/ui/badge'
