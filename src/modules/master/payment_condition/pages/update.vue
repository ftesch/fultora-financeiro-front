<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import PaymentConditionForm from '../components/PaymentConditionForm.vue'
import { usePaymentConditionStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Info, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PaymentConditionInfo from '../components/PaymentConditionInfo.vue'

const { updateData, findById } = usePaymentConditionStore()
const { loading, item } = storeToRefs(usePaymentConditionStore())
const route = useRoute()

async function submit() {
  await updateData()
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
      <Button to="/master/payment_condition" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <PaymentConditionForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
      <PageTab name="informacoes" label="Informações" :icon="Info">
        <PaymentConditionInfo />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
