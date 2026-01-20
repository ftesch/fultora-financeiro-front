<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui'

type MaskType = 'cpf' | 'cnpj' | 'cpf-cnpj' | 'phone'

const props = defineProps<{
  modelValue: string | null
  mask: MaskType
  placeholder?: string
  label?: string
  horizontal?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

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

/* ---------------- mask resolver ---------------- */

function applyMask(numeric: string) {
  if (!numeric) return ''

  if (props.mask === 'cpf') return formatCPF(numeric)
  if (props.mask === 'cnpj') return formatCNPJ(numeric)
  if (props.mask === 'phone') return formatPhone(numeric)

  return numeric.length <= 11 ? formatCPF(numeric) : formatCNPJ(numeric)
}

/* ---------------- computed ---------------- */

const maskedValue = computed(() => {
  return applyMask(onlyNumbers(props.modelValue ?? ''))
})

/* ---------------- handlers ---------------- */

// async function onInput(event: Event) {
//   const input = event.target as HTMLInputElement

//   const numeric = onlyNumbers(input.value)
//   const formatted = applyMask(numeric)

//   //input.value = formatted
//   emit('update:modelValue', numeric)

//   await nextTick()
// }

// function onInput(event: Event) {
//   const input = event.target as HTMLInputElement
//   const numeric = onlyNumbers(input.value)

//   emit('update:modelValue', numeric)
// }

function onInput(value: string) {
  const numeric = onlyNumbers(value)
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
        :placeholder="placeholder"
        inputmode="numeric"
        autocomplete="off"
        :disabled="disabled"
        @update:modelValue="onInput"
      />
    </div>
  </div>
</template>
