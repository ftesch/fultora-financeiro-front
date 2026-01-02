<template>
  <div class="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
    <h3 class="text-lg font-semibold">
      {{ product.name }}
    </h3>

    <p class="mt-2 text-sm text-muted-foreground">
      {{ product.description }}
    </p>

    <div class="mt-4 flex items-center justify-between">
      <span class="font-medium">
        {{ product.price }}
      </span>

      <Button size="sm">
        Comprar
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  product: {
    name: string
    description: string
    price: string
  }
}>()
</script>
