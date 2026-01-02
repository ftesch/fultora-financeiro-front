<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  for?: string
  required?: boolean
  error?: boolean
}>()

const classes = computed(() => ({
  'text-destructive': props.error,
}))
</script>

<template>
  <Label
    :for="for"
    class="text-sm font-medium leading-none"
    :class="classes"
  >
    <slot />

    <span v-if="required" class="ml-1 text-destructive">
      *
    </span>
  </Label>
</template>
