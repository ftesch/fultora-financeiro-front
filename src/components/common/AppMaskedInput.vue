<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { Input } from '@/components/ui'

type MaskType = 'cpf' | 'cnpj' | 'cpf-cnpj' | 'phone'

const props = defineProps<{
  modelValue: string | null
  mask: MaskType
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/* ---------------- utils ---------------- */

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
    // (99) 9999-9999
    return value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/^(\(\d{2}\)\s\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }

  // (99) 99999-9999
  return value
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^(\(\d{2}\)\s\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

/* ---------------- mask resolver ---------------- */

function applyMask(numeric: string) {
  if (!numeric) return ''

  if (props.mask === 'cpf') return formatCPF(numeric)
  if (props.mask === 'cnpj') return formatCNPJ(numeric)
  if (props.mask === 'phone') return formatPhone(numeric)

  // cpf-cnpj automático
  return numeric.length <= 11 ? formatCPF(numeric) : formatCNPJ(numeric)
}

/* ---------------- computed ---------------- */

const maskedValue = computed(() => {
  return applyMask(onlyNumbers(props.modelValue ?? ''))
})

/* ---------------- handlers ---------------- */

async function onInput(event: Event) {
  const input = event.target as HTMLInputElement

  const numeric = onlyNumbers(input.value)
  const formatted = applyMask(numeric)

  // atualiza visualmente
  input.value = formatted

  // estado sempre numérico
  emit('update:modelValue', numeric)

  await nextTick()
}
</script>

<template>
  <Input
    :value="maskedValue"
    :placeholder="placeholder"
    inputmode="numeric"
    autocomplete="off"
    @input="onInput"
  />
</template>
