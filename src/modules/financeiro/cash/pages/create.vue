<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import CashForm from '../components/CashForm.vue'
import { useCashStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetMovimento } = useCashStore()
const { loading } = storeToRefs(useCashStore())

async function submit() {
  await storeData()
  router.push('/financeiro/cash')
}

onMounted(() => {
  resetMovimento()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
    <template #actions>
      <Button to="/financeiro/cash" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <CashForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
