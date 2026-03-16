<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '../store'
import type { Account } from '../types'
import { AppSelect, Badge, Button, Dialog, Input, Switch, Table } from '@/components/ui'
import { CirclePlus, Pencil } from 'lucide-vue-next'

const { item, account } = storeToRefs(useCompanyStore())
const { resetAccount } = useCompanyStore()

const openForm = ref(false)
const editingAccountId = ref<string | null>(null)

const accountTypeOptions = [
  { label: 'Conta Bancaria', value: 'Conta Bancária' },
  { label: 'Conta Caixa', value: 'Conta Caixa' },
]

const columns = [
  {
    key: 'type',
    label: 'Tipo',
  },
  {
    key: 'banco',
    label: 'Banco',
  },
  {
    key: 'agencia',
    label: 'Agencia',
  },
  {
    key: 'conta_formatada',
    label: 'Conta',
  },
  {
    key: 'active',
    label: 'Status',
  },
]

const accounts = computed(() => item.value?.accounts ?? [])

function openCreateModal() {
  editingAccountId.value = null
  account.value = resetAccount()
  openForm.value = true
}

function openEditModal(account: Account) {
  editingAccountId.value = account.id
  openForm.value = true
}

function closeModal() {
  openForm.value = false
  editingAccountId.value = null
}

function updateOpenState(value: boolean) {
  if (!value) {
    closeModal()
    return
  }

  openForm.value = value
}

function saveAccount() {
  console.log(account.value)
  closeModal()
}
</script>

<template>
  <div class="space-y-4 bg-secondary/40 p-4 rounded-xl">
    <div class="flex justify-end">
      <Button label="Nova Conta" :icon="CirclePlus" @click="openCreateModal" />
    </div>

    <Table :columns="columns" :data="accounts" has-actions density="compact" variant="elevated">
      <template #cell:type="{ row }">
        <Badge>{{ row.type }}</Badge>
      </template>

      <template #cell:banco="{ row }">
        {{ row.banco || '-' }}
      </template>

      <template #cell:agencia="{ row }">
        {{ row.agencia || '-' }}
      </template>

      <template #cell:conta_formatada="{ row }">
        {{ row.conta ? `${row.conta}${row.digito_conta ? `-${row.digito_conta}` : ''}` : '-' }}
      </template>

      <template #cell:principal="{ row }">
        <Badge
          :class="
            row.principal ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
          "
        >
          {{ row.principal ? 'Sim' : 'Nao' }}
        </Badge>
      </template>

      <template #cell:active="{ row }">
        <Badge :class="row.active ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'">
          {{ row.active ? 'Ativa' : 'Inativa' }}
        </Badge>
      </template>

      <template #actions="{ row }">
        <Button variant="secondary" :icon="Pencil" @click="openEditModal(row)" />
      </template>
    </Table>

    <Dialog
      size="medium"
      :open="openForm"
      :title="editingAccountId ? 'Editar Conta Bancaria' : 'Nova Conta Bancaria'"
      description="Preencha os dados da conta. O salvamento ainda e apenas visual nesta etapa."
      confirmText="Salvar"
      @confirm="saveAccount"
      @cancel="closeModal"
      @update:open="updateOpenState"
    >
      <div class="bg-secondary/40 rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            v-model="account.type"
            label="Tipo"
            :horizontal="true"
            :options="accountTypeOptions"
          />

          <Input v-model="account.banco" label="Banco" :horizontal="true" placeholder="Ex: 237" />

          <Input
            v-model="account.agencia"
            label="Agencia"
            :horizontal="true"
            placeholder="Agencia"
          />

          <div class="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 md:col-span-2">
            <Input
              v-model="account.conta"
              label="Conta"
              :horizontal="true"
              placeholder="Numero da conta"
            />
            <Input
              v-model="account.digito_conta"
              label="Digito"
              :horizontal="true"
              placeholder="Digito"
            />
          </div>

          <Switch
            v-model="account.active"
            label="Conta Ativa"
            :horizontal="true"
            :true-value="true"
            :false-value="false"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
