<script setup lang="ts">
import { Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import { Badge } from '@/components/ui'
import { getTypeEntityLabel } from '../types'

const { fetchData } = useCompanyStore()
const { items, loading } = storeToRefs(useCompanyStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'id_fiscal',
    label: 'ID Fiscal',
  },
  {
    key: 'name',
    label: 'Nome',
  },
  {
    key: 'type_entity',
    label: 'Entidade',
  },
]
</script>

<template>
  <PageContainer title="Pessoas" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" to="/master/company/create" label="Novo" />
    </template>

    <Table
      :columns="columns"
      :data="items"
      has-actions
      density="compact"
      variant="elevated"
      :searchable="true"
    >
      <template #cell:type_entity="{ row }">
        <Badge variant="secondary">{{ getTypeEntityLabel(row.type_entity) }}</Badge>
      </template>
      <template #actions="{ row }">
        <Button variant="secondary" :icon="Pencil" :to="`/master/company/${row.id}/edit`" />
      </template>
    </Table>
  </PageContainer>
</template>
