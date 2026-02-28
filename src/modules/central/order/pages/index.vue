<script setup lang="ts">
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import OrderSearchForm from '../components/OrderSearchForm.vue'
import { formatCurrency, formatDateBR } from '@/utils/helpers'
import { getSituacaoOPColor, getSituacaoOPLabel } from '../types'

const { items, loading } = storeToRefs(useOrderStore())

const columns = [
  {
    key: 'op',
    label: 'OP',
  },
  {
    key: 'situacao_op',
    label: 'Situação',
  },
  {
    key: 'company',
    label: 'Empresa',
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
    key: 'data_vencimento',
    label: 'Vencimento',
  },
  {
    key: 'data_pagamento',
    label: 'Pagamento',
  },
  {
    key: 'valor_nominal',
    label: 'Valor',
  },
]
</script>

<template>
  <PageContainer title="Order" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" to="/central/order/create" label="Novo" />
    </template>

    <OrderSearchForm />

    <Table
      :columns="columns"
      :data="items"
      has-actions
      density="compact"
      variant="elevated"
      class="mt-4"
    >
      <template #cell:situacao_op="{ row }">
        <Badge :class="getSituacaoOPColor(row.situacao_op)">{{
          getSituacaoOPLabel(row.situacao_op)
        }}</Badge>
      </template>
      <template #cell:company="{ row }">
        {{ row.company.name }}
      </template>
      <template #cell:supplier="{ row }">
        {{ row.supplier.name }}
      </template>
      <template #cell:financial_category="{ row }">
        {{ row.financial_category.account }}-{{ row.financial_category.name }}
      </template>
      <template #cell:data_vencimento="{ row }">
        {{ formatDateBR(row.data_vencimento) }}
      </template>
      <template #cell:data_pagamento="{ row }">
        {{ formatDateBR(row.data_pagamento) }}
      </template>
      <template #cell:valor_nominal="{ row }">
        {{ formatCurrency(row.valor_nominal) }}
      </template>
      <template #actions="{ row }">
        <Button
          size="sm"
          variant="secondary"
          :icon="Pencil"
          :to="`/central/order/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
