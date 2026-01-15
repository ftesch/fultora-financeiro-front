<script setup lang="ts">
import { computed } from 'vue'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

const props = defineProps<{
  modelValue: boolean
  title: string
  size?: 'small' | 'medium' | 'large'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'max-w-md'
    case 'large':
      return 'max-w-[90vw]'
    default:
      return 'max-w-2xl'
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :class="[sizeClass, 'w-full max-h-[90vh] flex flex-col p-0']">
      <!-- Header -->
      <DialogHeader class="px-6 py-4 border-b">
        <DialogTitle class="text-lg font-semibold">
          {{ title }}
        </DialogTitle>
      </DialogHeader>

      <!-- Body (scrollável) -->
      <div class="flex-1 overflow-y-auto px-2 py-1">
        <slot />
      </div>

      <!-- Footer -->
      <DialogFooter class="flex items-center justify-between gap-2 px-6 py-4 border-t">
        <!-- Left -->
        <Button variant="outline" @click="open = false"> Fechar </Button>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
