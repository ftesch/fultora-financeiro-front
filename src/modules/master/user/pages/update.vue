<script setup lang="ts">
import { Button, PageContainer } from '@/components/ui'
import UserForm from '../components/UserForm.vue'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const { updateData, findById } = useUserStore()
const { loading, item } = storeToRefs(useUserStore())
const route = useRoute()

async function submit() {
  await updateData()
  router.push('/master/user')
}

onMounted(async () => {
  const id = route.params.id as string
  await findById(id)
})
</script>

<template>
  <PageContainer title="Alterar Usuario" :loading="loading">
    <template #actions>
      <Button to="/master/user" variant="secondary" :icon="ArrowLeft" label="Voltar" />
    </template>

    <UserForm :model-value="item" @submit="submit" />
  </PageContainer>
</template>
