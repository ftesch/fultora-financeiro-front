<script setup lang="ts">
import { Input } from '@/components/ui'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import { formatDateTimeBR } from '@/utils/helpers'

const { item } = storeToRefs(useCompanyStore())
</script>

<template>
  <div class="bg-secondary/40 p-4 rounded-xl">
    <div class="grid grid-cols-2 gap-3">
      <Input
        label="Criado em"
        :model-value="formatDateTimeBR(item?.created?.created_at)"
        disabled
      />
      <Input label="Criado por" :model-value="item?.created?.name" disabled />
      <Input
        label="Atualizado em"
        :model-value="formatDateTimeBR(item?.updated?.updated_at)"
        disabled
      />
      <Input label="Atualizado por" :model-value="item?.updated?.name" disabled />
    </div>
  </div>
</template>
