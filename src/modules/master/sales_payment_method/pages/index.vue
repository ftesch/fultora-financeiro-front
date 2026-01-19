<script setup lang="ts">
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { useSalesPaymentMethodStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'

const { fetchData } = useSalesPaymentMethodStore()
const { items, loading } = storeToRefs(useSalesPaymentMethodStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'order',
    label: 'Ordem',
  },
  {
    key: 'payment_method',
    label: 'Metodo de Pagamento',
  },
  {
    key: 'category',
    label: 'Categoria',
  },
  {
    key: 'payment_tax',
    label: 'Taxa',
  },
  {
    key: 'active',
    label: 'Ativo',
  },
]
</script>

<template>
  <PageContainer title="Metodos de Pagamento" :loading="loading">
    <template #actions>
      <Button
        :icon="CirclePlus"
        variant="secondary"
        to="/master/sales_payment_method/create"
        label="Novo"
      />
    </template>

    <Table :columns="columns" :data="items" has-actions density="compact" variant="elevated">
      <template #cell:category="{ row }">
        {{ `${row.category.account} - ${row.category.name}` }}
      </template>
      <template #cell:active="{ row }">
        <Badge :variant="row.active ? 'default' : 'destructive'">{{
          row.active ? 'Ativo' : 'Inativo'
        }}</Badge>
      </template>
      <template #actions="{ row }">
        <Button
          variant="secondary"
          :icon="Pencil"
          :to="`/master/sales_payment_method/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
