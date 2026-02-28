<script setup lang="ts">
import { Input } from '@/components/ui'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import { formatDateTimeBR } from '@/utils/helpers'

const { item } = storeToRefs(useOrderStore())
</script>

<template>
  <div class="bg-secondary/40 p-4 rounded-xl">
    <div class="grid grid-cols-2 gap-3">
      <Input
        label="Criado em"
        :model-value="formatDateTimeBR(item?.created?.created_at)"
        disabled
      />
      <Input label="Criado por" :model-value="item?.created?.created_by" disabled />
      <Input
        label="Atualizado em"
        :model-value="formatDateTimeBR(item?.updated?.updated_at)"
        disabled
      />
      <Input label="Atualizado por" :model-value="item?.updated?.updated_by" disabled />
    </div>
  </div>
</template>
