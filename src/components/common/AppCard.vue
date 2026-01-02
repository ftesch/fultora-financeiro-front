<script setup lang="ts">
import { Card } from '@/components/ui/card'

defineProps<{
  clickable?: boolean
}>()
</script>

<template>
  <Card
    class="rounded-xl border bg-card shadow-sm transition"
    :class="{ 'cursor-pointer hover:shadow-md': clickable }"
  >
    <div v-if="$slots.header" class="border-b px-6 py-4">
      <slot name="header" />
    </div>

    <div class="px-6 py-4">
      <slot />
    </div>

    <div v-if="$slots.footer" class="border-t px-6 py-4">
      <slot name="footer" />
    </div>
  </Card>
</template>
