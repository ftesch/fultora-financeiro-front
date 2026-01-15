<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import FinancialCategoryForm from '../components/FinancialCategoryForm.vue'
import { useFinancialCategoryStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetItem } = useFinancialCategoryStore()
const { loading } = storeToRefs(useFinancialCategoryStore())

async function submit() {
  await storeData()
  router.push('/master/financial_category')
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
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
        <FinancialCategoryForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
