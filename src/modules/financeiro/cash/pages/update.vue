<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import CashForm from '../components/CashForm.vue'
import { useCashStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const { updateData, findById } = useCashStore()
const { loading, item } = storeToRefs(useCashStore())
const route = useRoute()

async function submit() {
  await updateData()
  router.push('/financeiro/cash')
}

onMounted(async () => {
  const id = route.params.id as string
  await findById(id)
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Alterar" :loading="loading">
    <template #actions>
      <Button to="/financeiro/cash" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <CashForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
