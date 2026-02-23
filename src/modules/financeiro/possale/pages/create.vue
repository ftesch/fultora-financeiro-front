<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import { usePosSaleStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'
import PosSaleForm from '../components/PosSaleForm.vue'

const { storeData, resetItem } = usePosSaleStore()
const { loading } = storeToRefs(usePosSaleStore())

async function submit() {
  await storeData()
  router.push('/financeiro/pos_sale')
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
    <template #actions>
      <Button to="/financeiro/cash_flow" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <PosSaleForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
