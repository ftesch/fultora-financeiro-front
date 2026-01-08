<script setup lang="ts">
import { Button, PageContainer, Table } from '@/components/ui'
import { onMounted } from 'vue'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'
import { CirclePlus, Pencil } from 'lucide-vue-next'

const { fetchData } = useUserStore()
const { items, loading } = storeToRefs(useUserStore())

onMounted(async () => {
  await fetchData()
})

const columns = [
  {
    key: 'name',
    label: 'Nome',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'created_at',
    label: 'Criado em',
  },
  {
    key: 'updated_at',
    label: 'Atualizado em',
  },
]
</script>

<template>
  <PageContainer title="Usuário" :loading="loading">
    <template #actions>
      <Button :icon="CirclePlus" variant="secondary" to="/master/user/create" label="Novo" />
    </template>

    <Table :columns="columns" :data="items" has-actions density="compact" variant="elevated">
      <template #actions="{ row }">
        <Button :icon="Pencil" variant="secondary" :to="`/master/user/${row.id}/edit`" />
      </template>
    </Table>
  </PageContainer>
</template>
