<script setup lang="ts">
import { Button, PageContainer, WeekAgenda } from '@/components/ui'
import { onMounted } from 'vue'
import { useAgendaStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'
import type { Column } from '@/components/common/AppTable.vue'

const { fetchData } = useAgendaStore()
const { items, loading } = storeToRefs(useAgendaStore())

onMounted(async () => {
  await fetchData()
})

const columns: Column[] = [
  {
    key: 'data',
    label: 'Data',
  },
  {
    key: 'valor_apagar',
    label: 'A Pagar',
  },
  {
    key: 'valor_atrasado',
    label: 'Atrasado',
  },
  {
    key: 'valor_pago',
    label: 'Pago',
  },
]
</script>

<template>
  <PageContainer title="Agenda" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" label="Novo" />
    </template>

    <WeekAgenda :columns="columns" :data="items" has-actions row-key="data">
      <template #cell:data="{ value }">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</p>
        <p class="mt-1 text-base font-bold text-foreground">
          {{ value }}
        </p>
      </template>

      <template #actions="{ row }">
        <Button variant="secondary" :icon="Pencil" />
      </template>
    </WeekAgenda>
  </PageContainer>
</template>
