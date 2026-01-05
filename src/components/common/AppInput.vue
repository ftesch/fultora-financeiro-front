<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  error?: string
  type?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

const hasError = computed(() => !!props.error)
const hasSuffix = computed(() => !!useSlots().suffix)
</script>

<template>
  <div class="space-y-1.5">
    <!-- Label -->
    <Label v-if="label" :for="inputId">
      {{ label }}
    </Label>

    <!-- Input wrapper -->
    <div class="relative">
      <Input
        :id="inputId"
        :type="type || 'text'"
        :placeholder="placeholder"
        :model-value="modelValue"
        :disabled="disabled"
        :class="[
          hasError && 'border-destructive focus-visible:ring-destructive',
          hasSuffix && 'pr-10',
        ]"
        @update:modelValue="emit('update:modelValue', $event)"
      />

      <!-- 🔹 Suffix (icon / button) -->
      <div v-if="hasSuffix" class="absolute inset-y-0 right-0 flex items-center pr-2">
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error -->
    <p v-if="hasError" class="text-sm text-destructive">
      {{ error }}
    </p>
  </div>
</template>
