<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import CompanyForm from '../components/CompanyForm.vue'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Settings } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetItem } = useCompanyStore()
const { loading } = storeToRefs(useCompanyStore())

async function submit() {
  await storeData()
  router.push('/master/company')
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')
</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
    <template #actions>
      <Button to="/master/company" variant="secondary" :icon="ArrowLeft" label="Voltar" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <CompanyForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
