<script setup lang="ts">
import { AppSelect, Badge, Button, Dialog, Table } from '@/components/ui'
import { Delete, Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '../store'
import { ref } from 'vue'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppSwitch from '@/components/common/AppSwitch.vue'

const { companyPlans, companyPlan } = storeToRefs(useCompanyStore())
const { storePlan, deleteCompanyPlan } = useCompanyStore()
const openForm = ref(false)

const columns = [
  {
    key: 'module',
    label: 'Module',
  },
  {
    key: 'plan_id',
    label: 'Plano',
  },
  {
    key: 'quantity',
    label: 'Quantidade',
  },
  {
    key: 'users_limit',
    label: 'Limite de Usuários',
  },
]

const handDeletePlan = async (id: string) => {
  await deleteCompanyPlan(id)
}
</script>

<template>
  <div class="space-y-4 gap-3 bg-secondary/40 p-2 rounded-xl">
    <div class="text-right">
      <Button label="Novo Plano" :icon="Plus" @click="openForm = true" />
    </div>

    <div v-if="companyPlans">
      <Table
        :columns="columns"
        :data="companyPlans"
        has-actions
        density="compact"
        variant="elevated"
      >
        <template #cell:module="{ row }">
          <Badge>{{ typeof row.module === 'string' ? row.module : row.module?.label }}</Badge>
        </template>
        <template #cell:plan_id="{ row }">
          <Badge>{{ row.plan_id }}</Badge>
        </template>
        <template #actions="{ row }">
          <Button variant="destructive" :icon="Delete" @click="handDeletePlan(row.id)" />
        </template>
      </Table>
    </div>

    <Dialog
      :open="openForm"
      title="Novo Plano"
      description="Incluir novo plano"
      @confirm="storePlan"
      @cancel="openForm = false"
      confirmText="Salvar"
    >
      <div class="bg-secondary/40 rounded-xl">
        <form class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <AppSelect
              v-model="companyPlan.module"
              :horizontal="true"
              label="Modulo"
              :options="[
                { label: 'Financeiro', value: 'financeiro' },
                { label: 'Central Financeiro', value: 'central' },
              ]"
            />
            <AppSelect
              v-model="companyPlan.plan_id"
              :horizontal="true"
              label="Plano"
              :options="[
                { label: 'Standard', value: 'standard' },
                { label: 'Premium', value: 'premium' },
              ]"
            />

            <AppInputNumber
              label="Quantidade"
              :horizontal="true"
              v-model="companyPlan.quantity"
              :decimals="0"
            />

            <AppSwitch
              label="Ativo"
              :horizontal="true"
              v-model="companyPlan.active"
              :true-value="1"
              :false-value="0"
            />
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>
