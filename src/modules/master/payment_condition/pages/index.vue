<script setup lang="ts">
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { usePaymentConditionStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import { getStartInColor, getStartInLabel } from '../types'

const { fetchData } = usePaymentConditionStore()
const { items, loading } = storeToRefs(usePaymentConditionStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'title',
    label: 'Titulo',
  },
  {
    key: 'condition',
    label: 'Condição',
  },
  {
    key: 'start_in',
    label: 'Inica em',
  },
  {
    key: 'is_boleto',
    label: 'Boleto',
  },
]
</script>

<template>
  <PageContainer title="Condição de Pagamento" :loading="loading">
    <template #actions>
      <Button
        :icon="CirclePlus"
        variant="secondary"
        to="/master/payment_condition/create"
        label="Novo"
      />
    </template>

    <Table :columns="columns" :data="items" has-actions density="compact" variant="elevated">
      <template #cell:is_boleto="{ row }">
        <Badge :variant="row.is_boleto == 1 ? 'default' : 'secondary'">{{
          row.is_boleto == 1 ? 'Boleto' : 'Conta'
        }}</Badge>
      </template>
      <template #cell:start_in="{ row }">
        <Badge variant="secondary" :class="getStartInColor(row.start_in)">{{
          getStartInLabel(row.start_in)
        }}</Badge>
      </template>
      <template #actions="{ row }">
        <Button
          variant="secondary"
          :icon="Pencil"
          :to="`/master/payment_condition/${row.id}/edit`"
        />
      </template>
    </Table>
  </PageContainer>
</template>
