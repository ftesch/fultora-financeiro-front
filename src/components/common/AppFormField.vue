<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui'

const props = defineProps<{
  label?: string
  required?: boolean
  error?: string
  hint?: string
  for?: string
}>()

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="space-y-1.5">
    <!-- Label -->
    <Label
      v-if="label"
      :for="for"
      :required="required"
      :error="hasError"
    >
      {{ label }}
    </Label>

    <!-- Field -->
    <div>
      <slot />
    </div>

    <!-- Error -->
    <p
      v-if="hasError"
      class="text-sm text-destructive"
    >
      {{ error }}
    </p>

    <!-- Hint -->
    <p
      v-else-if="hint"
      class="text-sm text-muted-foreground"
    >
      {{ hint }}
    </p>
  </div>
</template>
