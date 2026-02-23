<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import { usePosSaleStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PosSaleForm from '../components/PosSaleForm.vue'
import router from '@/router'

const { updateData, findById } = usePosSaleStore()
const { loading, item } = storeToRefs(usePosSaleStore())
const route = useRoute()

async function submit() {
  await updateData()
  router.push('/financeiro/pos_sale')
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
      <Button to="/financeiro/pos_sale" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <PosSaleForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
