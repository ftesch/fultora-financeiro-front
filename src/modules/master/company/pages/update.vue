<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import CompanyForm from '../components/CompanyForm.vue'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, GroupIcon, InfoIcon } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import InfoForm from '../components/InfoForm.vue'
import CompanyGroupForm from '../components/CompanyGroupForm.vue'
import { TypeEntity } from '../types'

const { updateData, findById } = useCompanyStore()
const { loading, item } = storeToRefs(useCompanyStore())
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
  <PageContainer :title="`Alterar ${item?.name}`" :loading="loading">
    <template #actions>
      <Button to="/master/company" variant="secondary" :icon="ArrowLeft" label="Voltar" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <CompanyForm @submit="submit" mode="edit" />
      </PageTab>
      <PageTab
        name="group"
        label="Especificações"
        :icon="GroupIcon"
        v-if="
          item?.type_entity == TypeEntity.BusinessGroup || item?.type_entity == TypeEntity.Licensor
        "
      >
        <CompanyGroupForm />
      </PageTab>
      <PageTab name="info" label="Informações" :icon="InfoIcon">
        <InfoForm />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
