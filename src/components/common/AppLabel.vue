<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  for?: string
  required?: boolean
  error?: boolean
  right?: boolean
}>()

const classes = computed(() => ({
  'text-destructive': props.error,
  'text-right justify-end': props.right,
}))
</script>

<template>
  <Label :for="for" class="flex text-sm font-medium leading-none" :class="classes">
    <slot />

    <span v-if="required" class="ml-1 text-destructive"> * </span>
  </Label>
</template>
