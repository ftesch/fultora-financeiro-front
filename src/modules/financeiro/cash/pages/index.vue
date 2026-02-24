<script setup lang="ts">
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import { useCashStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import CashSearchForm from '../components/CashSearchForm.vue'
import { formatCurrency, formatDateBR } from '@/utils/helpers'

const { items, loading } = storeToRefs(useCashStore())

const columns = [
  {
    key: 'op',
    label: 'OP',
  },
  {
    key: 'company',
    label: 'company',
  },
  {
    key: 'supplier',
    label: 'Fornecedor/Cliente',
  },
  {
    key: 'financial_category',
    label: 'Categoria',
  },
  {
    key: 'date',
    label: 'Data',
  },
  {
    key: 'valor',
    label: 'Valor',
  },
]
</script>

<template>
  <PageContainer title="Cash" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" to="/financeiro/cash/create" label="Novo" />
    </template>

    <CashSearchForm />

    <Table
      :columns="columns"
      :data="items"
      has-actions
      density="compact"
      variant="elevated"
      class="mt-4"
    >
      <template #cell:company="{ row }">
        {{ row.company.name }}
      </template>
      <template #cell:supplier="{ row }">
        {{ row.supplier.name }}
      </template>

      <template #cell:financial_category="{ row }">
        <span>{{ `${row.financial_category.account} ${row.financial_category.name}` }}</span>
        <Badge
          :class="[
            'ml-2 border-transparent',
            row.financial_category.type == 'D' ? 'bg-blue-500' : 'bg-green-500',
          ]"
        >
          {{ row.financial_category.type == 'D' ? 'Debito' : 'Credito' }}
        </Badge>
      </template>
      <template #cell:date="{ row }">
        {{ formatDateBR(row.date) }}
      </template>
      <template #cell:valor="{ row }">
        {{ formatCurrency(row.valor) }}
      </template>

      <template #actions="{ row }">
        <Button
          size="sm"
          variant="secondary"
          :icon="Pencil"
          :to="`/financeiro/cash/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
