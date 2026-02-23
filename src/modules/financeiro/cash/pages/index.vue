<script setup lang="ts">
import { Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { useCashStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'

const { fetchData } = useCashStore()
const { items, loading } = storeToRefs(useCashStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'company',
    label: 'company',
  },
  {
    key: 'date',
    label: 'date',
  },
  {
    key: 'open_balance',
    label: 'open_balance',
  },
  {
    key: 'close_balance',
    label: 'close_balance',
  },
]
</script>

<template>
  <PageContainer title="Cash" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" to="/financeiro/cash/create" label="Novo" />
    </template>

    <Table :columns="columns" :data="items" has-actions density="compact" variant="elevated">
      <template #actions="{ row }">
        <Button variant="secondary" :icon="Pencil" :to="`/financeiro/cash/${row.id}/edit`" />
      </template>
    </Table>
  </PageContainer>
</template>
