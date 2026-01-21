<script setup lang="ts">
import { Button, Table } from '@/components/ui'
import { Delete, Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '../store'

const { companyPlans } = storeToRefs(useCompanyStore())
const { fetchCompanyPlansData } = useCompanyStore()

const columns = [
  {
    key: 'plan_id',
    label: 'Plano',
  },
  {
    key: 'quantity',
    label: 'Quantidade',
  },
  {
    key: 'module',
    label: 'Module',
  },
  {
    key: 'users_limit',
    label: 'users_limit',
  },
  {
    key: 'companies_limit',
    label: 'companies_limit',
  },
]
</script>

<template>
  <div class="space-y-4 gap-3 bg-secondary/40 p-2 rounded-xl">
    <div class="text-right">
      <Button label="Nova Plano" :icon="Plus" />
    </div>

    <div v-if="companyPlans">
      <Table
        :columns="columns"
        :data="companyPlans"
        has-actions
        density="compact"
        variant="elevated"
        :auto-fetch-on-empty="true"
        @empty="fetchCompanyPlansData"
      >
        <template #actions="{ row }">
          <Button variant="destructive" :icon="Delete" />
        </template>
      </Table>
    </div>
  </div>
</template>
