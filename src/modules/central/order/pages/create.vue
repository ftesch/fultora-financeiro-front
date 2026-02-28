<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import OrderForm from '../components/OrderForm.vue'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetItem } = useOrderStore()
const { loading } = storeToRefs(useOrderStore())

async function submit() {
  await storeData()
  router.push('/central/order')
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Nova Ordem de Pagamento" :loading="loading">
    <template #actions>
      <Button to="/central/order" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <OrderForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
