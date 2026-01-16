<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import UserForm from '../components/UserForm.vue'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Info, RotateCcw, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import UserFormInfo from '../components/UserFormInfo.vue'

const { updateData, findById, resetPassword } = useUserStore()
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

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Alterar Usuario" :loading="loading">
    <template #actions>
      <Button to="/master/user" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="RotateCcw" @click="resetPassword" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <UserForm :model-value="item" @submit="submit" />
      </PageTab>
      <PageTab name="info" label="Informações" :icon="Info">
        <UserFormInfo />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
