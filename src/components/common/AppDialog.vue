<script setup lang="ts">
import { computed } from 'vue'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

const props = defineProps<{
  open: boolean
  title: string
  description?: string
  size?: 'small' | 'medium' | 'large'
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const open = computed({
  get: () => props.open,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('update:open', value)
  },
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'sm:max-w-md'
    case 'large':
      return 'sm:max-w-[90vw]'
    default:
      return 'sm:max-w-2xl'
  }
})

function handleCancel() {
  emit('cancel')
  open.value = false
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :class="[sizeClass, 'w-full max-h-[90vh] flex flex-col p-0']">
      <!-- Header -->
      <DialogHeader class="px-6 py-4 border-b space-y-1">
        <DialogTitle class="text-lg font-semibold">
          {{ title }}
        </DialogTitle>

        <DialogDescription v-if="description" class="text-sm text-muted-foreground">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <!-- Body (scrollável) -->
      <div class="flex-1 overflow-y-auto px-4 py-1">
        <slot />
      </div>

      <!-- Footer -->
      <DialogFooter class="flex items-center justify-between gap-2 px-6 py-4 border-t">
        <!-- Cancel -->
        <Button variant="outline" @click="handleCancel">
          {{ cancelText || 'Fechar' }}
        </Button>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <slot name="actions" />

          <Button v-if="confirmText" @click="handleConfirm">
            {{ confirmText }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
