<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import OrderForm from '../components/OrderForm.vue'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, InfoIcon, Save, TimerIcon } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import InfoForm from '../components/InfoForm.vue'
import TimeLine from '../components/TimeLine.vue'

const { updateData, findById } = useOrderStore()
const { loading, item } = storeToRefs(useOrderStore())
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
      <Button to="/central/order" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" to="`/central/order/${item.id}/`" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <OrderForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
      <PageTab name="timeline" label="Linha do Tempo" :icon="TimerIcon">
        <TimeLine />
      </PageTab>
      <PageTab name="info" label="Informações" :icon="InfoIcon">
        <InfoForm />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
