<script setup lang="ts">
import { Button, PageContainer, Table } from '@/components/ui'
import { usePosSaleStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import { formatDateBR } from '@/utils/helpers'
import PosSaleSearchForm from '../components/PosSaleSearchForm.vue'

const { items, loading } = storeToRefs(usePosSaleStore())

const columns = [
  {
    key: 'date',
    label: 'Data',
  },
  {
    key: 'company',
    label: 'Empresa',
  },
]
</script>

<template>
  <PageContainer title="Movimento de PDV" :loading="loading">
    <template #actions>
      <Button
        :icon="CirclePlus"
        variant="secondary"
        to="/financeiro/pos_sale/create"
        label="Novo Movimento"
      />
    </template>

    <PosSaleSearchForm />

    <Table
      :columns="columns"
      :data="items"
      has-actions
      density="compact"
      variant="elevated"
      class="mt-4"
    >
      <template #cell:date="{ row }">
        <span>{{ formatDateBR(row.date) }}</span>
      </template>
      <template #cell:company="{ row }">
        <span>{{ row.company.name }}</span>
      </template>

      <template #actions="{ row }">
        <Button
          size="sm"
          variant="secondary"
          :icon="Pencil"
          :to="`/financeiro/pos_sale/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
