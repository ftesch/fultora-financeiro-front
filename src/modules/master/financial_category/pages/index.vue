<script setup lang="ts">
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { useFinancialCategoryStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import { getFinancialCategoryTypeLabel, getFinancialCategoryTypeVariant } from '../types'

const { fetchData } = useFinancialCategoryStore()
const { items, loading } = storeToRefs(useFinancialCategoryStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'account',
    label: 'Conta',
  },
  {
    key: 'name',
    label: 'Nome',
  },
  {
    key: 'type',
    label: 'Tipo',
  },
]
</script>

<template>
  <PageContainer title="Categoria Financeira" :loading="loading">
    <template #actions>
      <Button
        :icon="CirclePlus"
        variant="secondary"
        to="/master/financial_category/create"
        label="Novo"
      />
    </template>

    <Table :columns="columns" :data="items" has-actions density="compact" variant="elevated">
      <template #cell:type="{ row }">
        <Badge :variant="getFinancialCategoryTypeVariant(row.type)">{{
          getFinancialCategoryTypeLabel(row.type)
        }}</Badge>
      </template>
      <template #actions="{ row }">
        <Button
          variant="secondary"
          :icon="Pencil"
          :to="`/master/financial_category/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
