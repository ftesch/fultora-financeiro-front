<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui'

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
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <Label v-if="label" :class="horizontal ? 'min-w-[140px] text-right' : ''" :right="horizontal">
      {{ label }}
    </Label>
    <!-- 
  <label
    class="flex gap-2 cursor-pointer"
    :class="horizontal ? 'items-center' : 'flex-col items-start'"
  > -->

    <!-- Switch -->
    <Switch :model-value="isChecked" @update:modelValue="onChange" />
  </div>
</template>
