<script setup lang="ts">
import { Card } from '@/components/ui/card'

type CardDensity = 'default' | 'compact'

const props = defineProps<{
  clickable?: boolean
  density?: CardDensity
}>()

const density = props.density ?? 'default'

const densityClassMap = {
  default: {
    header: 'px-6 py-2',
    content: 'px-6 py-4',
    footer: 'px-6 py-2',
  },
  compact: {
    header: 'px-2 py-1',
    content: 'px-2 py-1',
    footer: 'px-2 py-1',
  },
}
</script>

<template>
  <Card
    class="rounded-xl border bg-card shadow-sm transition"
    :class="{ 'cursor-pointer hover:shadow-md': clickable }"
  >
    <!-- Header -->
    <div v-if="$slots.header" class="border-b" :class="densityClassMap[density].header">
      <slot name="header" />
    </div>

    <!-- Content -->
    <div :class="densityClassMap[density].content">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="border-t" :class="densityClassMap[density].footer">
      <slot name="footer" />
    </div>
  </Card>
</template>
