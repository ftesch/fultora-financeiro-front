<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import PaymentConditionForm from '../components/PaymentConditionForm.vue'
import { usePaymentConditionStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetItem } = usePaymentConditionStore()
const { loading } = storeToRefs(usePaymentConditionStore())

async function submit() {
  await storeData()
  router.push('/master/payment_condition')
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
    <template #actions>
      <Button to="/master/payment_condition" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <PaymentConditionForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
