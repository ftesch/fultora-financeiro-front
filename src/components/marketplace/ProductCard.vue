<template>
  <div class="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
    <h3 class="text-lg font-semibold">
      {{ product.name }}
    </h3>

    <p class="mt-2 text-sm text-muted-foreground">
      {{ product.description }}
    </p>

    <div class="mt-4 flex justify-end">
      <Button size="sm" @click="buy"> Comprar </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui'
import router from '@/router'
import { useMarketplaceStore } from '@/stores/marketplace'
const { setPurchaseProduct } = useMarketplaceStore()

const props = defineProps<{
  product: {
    id: string
    name: string
    description: string
  }
}>()

const buy = () => {
  setPurchaseProduct(props.product.id)
  router.push({ name: 'MarketplacePurchase', params: { id: props.product.id } })
}
</script>
