<template>
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/marketplace/ProductCard.vue'

const products = [
  {
    id: 1,
    name: 'Módulo Financeiro',
    description: 'Controle financeiro avançado',
    price: 'R$ 49,90',
  },
  {
    id: 2,
    name: 'Módulo CRM',
    description: 'Gestão de clientes',
    price: 'R$ 29,90',
  },
]
</script>
