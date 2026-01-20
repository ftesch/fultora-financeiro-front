<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  error?: string
  type?: string
  disabled?: boolean
  horizontal?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const slots = useSlots()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

const showPassword = ref(false)

const isPassword = computed(() => props.type === 'password')

const inputType = computed(() => {
  if (!isPassword.value) return props.type || 'text'
  return showPassword.value ? 'text' : 'password'
})

const hasError = computed(() => !!props.error)
const hasSuffix = computed(() => !!slots.suffix || isPassword.value)

function togglePassword() {
  showPassword.value = !showPassword.value
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

    <!-- Input wrapper -->
    <div class="relative flex-1">
      <Input
        :id="inputId"
        :type="inputType"
        :placeholder="placeholder"
        :model-value="modelValue"
        :disabled="disabled"
        :class="[
          hasError && 'border-destructive focus-visible:ring-destructive',
          hasSuffix && 'pr-10',
        ]"
        @update:modelValue="emit('update:modelValue', $event)"
      />

      <!-- 🔹 Password toggle -->
      <button
        v-if="isPassword"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground hover:text-foreground"
        @click="togglePassword"
        :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
      >
        <Eye v-if="!showPassword" class="h-4 w-4" />
        <EyeOff v-else class="h-4 w-4" />
      </button>

      <!-- 🔹 Suffix (icon / button customizado) -->
      <div v-else-if="slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-2">
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error -->
    <p v-if="hasError" class="text-sm text-destructive">
      {{ error }}
    </p>
  </div>
</template>
