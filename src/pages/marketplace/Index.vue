<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ProductCard v-for="product in modules" :key="product.id" :product="product" />
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/marketplace/ProductCard.vue'
import { useLicensorStore } from '@/stores/licensor'
import { useMarketplaceStore } from '@/stores/marketplace'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const { fetchModules } = useMarketplaceStore()
const { fetchPrincipalCompany } = useLicensorStore()

const { loading, modules } = storeToRefs(useMarketplaceStore())

onMounted(async () => {
  await fetchModules()
  await fetchPrincipalCompany()
})
</script>
