<script setup lang="ts">
import { Button, PageContainer } from '@/components/ui'
import UserForm from '../components/UserForm.vue'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft } from 'lucide-vue-next'
import { onMounted } from 'vue'
import router from '@/router'

const { storeData, resetItem } = useUserStore()
const { loading } = storeToRefs(useUserStore())

async function submit() {
  await storeData()
  router.push('/master/user')
}

onMounted(() => {
  resetItem()
})
</script>

<template>
  <PageContainer title="Novo Usuario" :loading="loading">
    <template #actions>
      <Button to="/master/user" variant="secondary" :icon="ArrowLeft" label="Voltar" />
    </template>
    <UserForm @submit="submit" />
  </PageContainer>
</template>
