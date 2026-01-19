<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@/components/ui/switch'

const props = defineProps<{
  modelValue: any
  label?: string
  horizontal?: boolean
  trueValue: any
  falseValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isChecked = computed<boolean>(() => {
  return props.modelValue === props.trueValue
})

function onChange(value: boolean) {
  emit('update:modelValue', value ? props.trueValue : props.falseValue)
}
</script>

<template>
  <label
    class="flex gap-2 cursor-pointer"
    :class="horizontal ? 'items-center' : 'flex-col items-start'"
  >
    <!-- Label -->
    <span v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
    </span>

    <!-- Switch -->
    <Switch :model-value="isChecked" @update:modelValue="onChange" />
  </label>
</template>
