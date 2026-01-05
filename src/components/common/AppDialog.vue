<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui'

type DialogDensity = 'default' | 'compact'

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  density?: DialogDensity
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}

const density = props.density ?? 'default'

const densityClassMap = {
  default: {
    content: 'sm:max-w-3xl',
    header: 'pb-4 gap-2',
    body: 'max-h-[70vh] overflow-y-auto pr-1 pt-4',
    footer: 'gap-2 pt-4',
    title: 'text-lg',
    description: '',
  },
  compact: {
    content: 'sm:max-w-3xl',
    header: 'pb-2 gap-1',
    body: 'max-h-[70vh] overflow-y-auto pr-0 pt-2',
    footer: 'gap-1 pt-2',
    title: 'text-base',
    description: 'text-sm',
  },
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent :class="densityClassMap[density].content">
      <!-- Header -->
      <DialogHeader v-if="title || description" :class="densityClassMap[density].header">
        <DialogTitle v-if="title" :class="densityClassMap[density].title">
          {{ title }}
        </DialogTitle>

        <DialogDescription v-if="description" :class="densityClassMap[density].description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <!-- Conteúdo -->
      <div :class="densityClassMap[density].body">
        <slot />
      </div>

      <!-- Footer -->
      <DialogFooter :class="densityClassMap[density].footer">
        <Button variant="outline" type="button" :disabled="loading" @click="onCancel">
          {{ cancelText ?? 'Cancelar' }}
        </Button>

        <Button type="button" :loading="loading" @click="emit('confirm')">
          {{ confirmText ?? 'Salvar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
