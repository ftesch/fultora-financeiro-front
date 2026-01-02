<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <div class="space-y-1.5">
    <!-- Label -->
    <Label v-if="label" :for="inputId">
      {{ label }}
    </Label>

    <!-- Input -->
    <Input
      :id="inputId"
      :type="type || 'text'"
      :placeholder="placeholder"
      :model-value="modelValue"
      :disabled="disabled"
      :class="{
        'border-destructive focus-visible:ring-destructive': hasError,
      }"
      @update:modelValue="emit('update:modelValue', $event)"
    />

    <!-- Error -->
    <p v-if="hasError" class="text-sm text-destructive">
      {{ error }}
    </p>
  </div>
</template>
