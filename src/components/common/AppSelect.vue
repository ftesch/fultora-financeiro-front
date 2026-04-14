<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

type Option = {
  label: string
  value: string | number | Record<string, any> | null
}

const props = defineProps<{
  modelValue?: string | number | Record<string, any> | null
  options: Option[]
  label?: string
  placeholder?: string
  horizontal?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | Record<string, any> | null): void
}>()

const inputId = `select-${Math.random().toString(36).substring(2, 9)}`

const model = computed({
  get: () => props.modelValue,
  set: (value) =>
    emit('update:modelValue', value as string | number | Record<string, any> | null),
})
</script>

<template>
  <div :class="[horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <!-- Label -->
    <Label
      v-if="label"
      :for="inputId"
      :class="horizontal ? 'min-w-[140px] text-right' : ''"
      :right="horizontal"
    >
      {{ label }}
    </Label>

    <!-- Select -->
    <div class="flex-1">
      <Select v-model="model" :disabled="disabled">
        <SelectTrigger :id="inputId">
          <SelectValue :placeholder="placeholder ?? 'Selecione uma opção'" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem v-for="(option, index) in options" :key="index" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
