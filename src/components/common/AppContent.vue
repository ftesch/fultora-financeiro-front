<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps<{
  label?: string
  horizontal?: boolean
}>()
</script>

<template>
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <!-- Label -->
    <Label v-if="label" :class="horizontal ? 'min-w-[140px] text-right' : ''" :right="horizontal">
      {{ label }}
    </Label>

    <!-- Input wrapper -->
    <div class="relative flex-1">
      <slot />
    </div>
  </div>
</template>
