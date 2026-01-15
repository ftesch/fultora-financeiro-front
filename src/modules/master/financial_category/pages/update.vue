<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import FinancialCategoryForm from '../components/FinancialCategoryForm.vue'
import { useFinancialCategoryStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Info, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FinancialCategoryFormInfo from '../components/FinancialCategoryFormInfo.vue'

const { updateData, findById } = useFinancialCategoryStore()
const { loading, item } = storeToRefs(useFinancialCategoryStore())
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
      <Button
        to="/master/financial_category"
        variant="secondary"
        :icon="ArrowLeft"
        label="Voltar"
      />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <FinancialCategoryForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
      <PageTab name="info" label="Informações" :icon="Info">
        <FinancialCategoryFormInfo />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
