<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui'

/* ---------------- types ---------------- */

type MaskType = 'cpf' | 'cnpj' | 'cpf-cnpj' | 'phone' | 'date' | 'boleto'

/* ---------------- max length ---------------- */

const MASK_MAX_LENGTH: Record<MaskType, number> = {
  cpf: 14, // 000.000.000-00
  cnpj: 18, // 00.000.000/0000-00
  'cpf-cnpj': 18,
  phone: 15, // (00) 00000-0000
  date: 10, // dd/mm/yyyy
  boleto: 54, // linha digitável completa
}

const props = defineProps<{
  modelValue: string | null
  mask: MaskType
  placeholder?: string
  label?: string
  horizontal?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (
    e: 'boletoData',
    data: {
      bank: string
      dueDate: string | null
      amount: number | null
    },
  ): void
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

const maxLength = computed(() => MASK_MAX_LENGTH[props.mask])

/* ---------------- helpers ---------------- */

function onlyNumbers(value: string) {
  return value.replace(/\D/g, '')
}

/* CPF */
function formatCPF(value: string) {
  return value
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14)
}

/* CNPJ */
function formatCNPJ(value: string) {
  return value
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    .slice(0, 18)
}

/* 📱 Telefone */
function formatPhone(value: string) {
  if (value.length <= 10) {
    return value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^(\(\d{2}\)\s\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }

  return value
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^(\(\d{2}\)\s\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

/* 💳 Linha digitável boleto */
function formatBoleto(value: string) {
  return (
    value
      // 1º bloco
      .replace(/^(\d{5})(\d)/, '$1.$2')
      .replace(/^(\d{5})\.(\d{5})(\d)/, '$1.$2 $3')

      // 2º bloco
      .replace(/^(\d{5})\.(\d{5}) (\d{5})(\d)/, '$1.$2 $3.$4')
      .replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6})(\d)/, '$1.$2 $3.$4 $5')

      // 3º bloco
      .replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6}) (\d{5})(\d)/, '$1.$2 $3.$4 $5.$6')

      // 4º e 5º bloco
      .replace(/^(\d{5})\.(\d{5}) (\d{5})\.(\d{6}) (\d{5})\.(\d{6})(\d)/, '$1.$2 $3.$4 $5.$6 $7')
      .slice(0, 54)
  ) // tamanho máximo com máscara
}

/* 📅 Data dd/mm/yyyy (UI) */
function formatDate(numeric: string) {
  return numeric
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    .slice(0, 10)
}

/* ---------------- date conversions ---------------- */

/* yyyy-mm-dd → ddmmyyyy */
function fromISODate(value: string) {
  if (!value) return ''

  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return ''

  return `${day}${month}${year}`
}

/* ddmmyyyy → yyyy-mm-dd */
function toISODate(numeric: string): string | null {
  if (numeric.length !== 8) return null

  const day = numeric.slice(0, 2)
  const month = numeric.slice(2, 4)
  const year = numeric.slice(4, 8)

  return `${year}-${month}-${day}`
}

function calculateDueDate(factor: string): string | null {
  if (!factor || factor === '0000') return null

  const factorNumber = Number(factor)

  // Nova base
  const resetDate = new Date('2025-02-22T00:00:00')

  if (factorNumber >= 1000) {
    const days = factorNumber - 1000
    resetDate.setDate(resetDate.getDate() + days)

    return resetDate.toISOString().split('T')[0] ?? null
  }

  // Regra antiga
  const baseDate = new Date('1997-10-07T00:00:00')
  baseDate.setDate(baseDate.getDate() + factorNumber)

  return baseDate.toISOString().split('T')[0] ?? null
}

function extractBoletoData(numeric: string) {
  if (numeric.length !== 47) return null

  const bank = numeric.slice(0, 3)
  const factor = numeric.slice(33, 37)
  const valueField = numeric.slice(37, 47)

  const dueDate = calculateDueDate(factor)

  const amount = Number(valueField) > 0 ? Number(valueField) / 100 : null

  return {
    bank,
    dueDate,
    amount,
  }
}

/* ---------------- mask resolver ---------------- */

function applyMask(numeric: string) {
  if (!numeric) return ''

  switch (props.mask) {
    case 'cpf':
      return formatCPF(numeric)
    case 'cnpj':
      return formatCNPJ(numeric)
    case 'phone':
      return formatPhone(numeric)
    case 'date':
      return formatDate(numeric)
    case 'boleto':
      return formatBoleto(numeric)
    default:
      return numeric.length <= 11 ? formatCPF(numeric) : formatCNPJ(numeric)
  }
}

/* ---------------- computed ---------------- */

const maskedValue = computed(() => {
  if (props.mask === 'date') {
    return formatDate(fromISODate(props.modelValue ?? ''))
  }

  return applyMask(onlyNumbers(props.modelValue ?? ''))
})

/* ---------------- handlers ---------------- */

function onInput(value: string | number | null) {
  const numeric = onlyNumbers(String(value))

  if (props.mask === 'date') {
    const iso = toISODate(numeric)
    emit('update:modelValue', iso)
    return
  }

  if (props.mask === 'boleto') {
    emit('update:modelValue', numeric)

    if (numeric.length === 47) {
      const data = extractBoletoData(numeric)

      if (data) {
        emit('boletoData', data)
      }
    }

    return
  }

  emit('update:modelValue', numeric)
}
</script>

<template>
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <!-- Label -->
    <Label
      v-if="label"
      :for="inputId"
      :class="horizontal ? 'min-w-[140px] text-right' : ''"
      :right="horizontal"
    >
      {{ label }}
    </Label>

    <!-- Input -->
    <div class="flex-1">
      <Input
        :id="inputId"
        :model-value="maskedValue"
        :placeholder="
          placeholder ??
          (mask === 'date'
            ? 'dd/mm/aaaa'
            : mask === 'boleto'
              ? '00000.00000 00000.000000 00000.000000 0 00000000000000'
              : '')
        "
        inputmode="numeric"
        autocomplete="off"
        :disabled="disabled"
        :maxlength="maxLength"
        @update:modelValue="onInput"
      />
    </div>
  </div>
</template>
