<script setup lang="ts">
import { AppSelect, Badge, Button, Dialog, Table } from '@/components/ui'
import { Delete, Plus } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '../store'
import { ref } from 'vue'
import AppSwitch from '@/components/common/AppSwitch.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { formatDateTimeBR } from '@/utils/helpers'

const { companyUsers, companyUser } = storeToRefs(useCompanyStore())
const { storeUser, fetchUsers } = useCompanyStore()
const openForm = ref(false)

const columns = [
  {
    key: 'user',
    label: 'User',
  },
  {
    key: 'module',
    label: 'Module',
  },
  {
    key: 'role',
    label: 'Função',
  },
  {
    key: 'created',
    label: 'Criado em',
  },
]
</script>

<template>
  <div class="space-y-4 gap-3 bg-secondary/40 p-2 rounded-xl">
    <div class="text-right">
      <Button label="Novo Usuário" :icon="Plus" @click="openForm = true" />
    </div>

    <div v-if="companyUser">
      <Table
        :columns="columns"
        :data="companyUsers"
        has-actions
        density="compact"
        variant="elevated"
      >
        <template #cell:user="{ row }">
          {{ row.user.name }}
        </template>
        <template #cell:module="{ row }">
          <Badge>{{ row.module.label }}</Badge>
        </template>
        <template #cell:role="{ row }">
          <Badge>{{ row.role }}</Badge>
        </template>
        <template #cell:created="{ row }">
          {{ formatDateTimeBR(row.created.created_at) }}
        </template>
        <template #actions="{ row }">
          <Button variant="destructive" :icon="Delete" />
        </template>
      </Table>
    </div>

    <Dialog
      :open="openForm"
      title="Novo Usuário"
      description="Incluir novo usuário"
      @confirm="storeUser"
      @cancel="openForm = false"
      confirmText="Salvar"
    >
      <div class="bg-secondary/40 rounded-xl">
        <form class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <AppSelect
              v-model="companyUser.module"
              :horizontal="true"
              label="Modulo"
              :options="[
                { label: 'Financeiro', value: 'financeiro' },
                { label: 'Central Financeiro', value: 'central' },
              ]"
            />

            <AppLookup
              v-model="companyUser.user_id"
              v-model:object="companyUser.user"
              label="Usuário"
              horizontal
              placeholder="Selecione um usuário"
              :fetch="fetchUsers"
              :columns="[
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'Email' },
              ]"
            />

            <AppSelect
              v-model="companyUser.role"
              :horizontal="true"
              label="Modulo"
              :options="[
                { label: 'Usuário', value: 'user' },
                { label: 'Administrador', value: 'admin' },
              ]"
            />

            <AppSwitch
              label="Ativo"
              :horizontal="true"
              v-model="companyUser.active"
              :true-value="1"
              :false-value="0"
            />
          </div>
        </form>
      </div>
    </Dialog>
  </div>
</template>
