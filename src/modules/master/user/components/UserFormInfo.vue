<script setup lang="ts">
import { Input } from '@/components/ui'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'

const { item } = storeToRefs(useUserStore())
</script>

<template>
  <div class="bg-secondary/40 p-4 rounded-xl">
    <div class="grid grid-cols-2 gap-3">
      <Input label="Criado em" :model-value="item?.created_at" disabled />
      <Input label="Atualizado em" :model-value="item?.updated_at" disabled />
    </div>
  </div>
</template>
