<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Label } from '@/components/ui'

const props = defineProps<{
  modelValue: number | null | undefined
  label?: string
  horizontal?: boolean
  error?: string
  decimals?: number
  allowNegative?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const decimals = computed(() => props.decimals ?? 2)
const allowNegative = computed(() => props.allowNegative ?? false)

/**
 * Estado interno
 */
const innerValue = ref('')
const isFocused = ref(false)

/**
 * Formatter BR
 */
const formatter = computed(
  () =>
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals.value,
      maximumFractionDigits: decimals.value,
    }),
)

/**
 * Sincroniza SOMENTE quando não está focado
 */
watch(
  () => props.modelValue,
  (value) => {
    if (isFocused.value) return

    if (value === null || value === undefined || Number.isNaN(value)) {
      innerValue.value = ''
      return
    }

    innerValue.value = formatter.value.format(value)
  },
  { immediate: true },
)

/**
 * Focus → remove máscara
 */
function onFocus() {
  isFocused.value = true

  if (props.modelValue === null || props.modelValue === undefined) {
    innerValue.value = ''
    return
  }

  innerValue.value = String(props.modelValue)
}

/**
 * Input (sem máscara)
 */
function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(',', '.')

  const regex = new RegExp(`^${allowNegative.value ? '-?' : ''}\\d*(\\.\\d{0,${decimals.value}})?$`)

  if (!regex.test(value)) {
    input.value = innerValue.value
    return
  }

  innerValue.value = value

  if (value === '' || value === '-' || value === '.') {
    emit('update:modelValue', null)
    return
  }

  const numberValue = Number(value)
  emit('update:modelValue', Number.isNaN(numberValue) ? null : numberValue)
}

/**
 * Blur → aplica máscara
 */
function onBlur() {
  isFocused.value = false

  if (!innerValue.value) {
    emit('update:modelValue', null)
    return
  }

  const numberValue = Number(innerValue.value)

  if (Number.isNaN(numberValue)) {
    innerValue.value = ''
    emit('update:modelValue', null)
    return
  }

  innerValue.value = formatter.value.format(numberValue)
  emit('update:modelValue', numberValue)
}
</script>

<template>
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <!-- Label -->
    <Label v-if="label" :class="horizontal ? 'min-w-[140px] text-right' : ''" :right="horizontal">
      {{ label }}
    </Label>

    <!-- Field -->
    <div class="flex-1 space-y-1">
      <input
        type="text"
        inputmode="decimal"
        :disabled="disabled"
        :value="innerValue"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        class="w-full rounded-md border selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 px-3 py-2 text-sm shadow-sm text-right tabular-nums focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      <p v-if="error" class="text-xs text-destructive">
        {{ error }}
      </p>
    </div>
  </div>
</template>
