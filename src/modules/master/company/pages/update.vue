<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import CompanyForm from '../components/CompanyForm.vue'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  GroupIcon,
  InfoIcon,
  Save,
  UserCheck,
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import InfoForm from '../components/InfoForm.vue'
import CompanyGroupForm from '../components/CompanyGroupForm.vue'
import { TypeEntity } from '../types'
import CompanyPlans from '../components/CompanyPlans.vue'
import CompanyUsers from '../components/CompanyUsers.vue'
const { updateData, findById, fetchCompanyPlansData, fetchCompanyUserData } = useCompanyStore()
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

const onChangTab = async () => {
  if (activeTab.value == 'license') {
    await fetchCompanyPlansData()
  }
  if (activeTab.value == 'users') {
    await fetchCompanyUserData()
  }
}
</script>

<template>
  <PageContainer :title="`Alterar ${item?.name}`" :loading="loading">
    <template #actions>
      <Button to="/master/company" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button type="button" @click="submit" :loading="loading" :icon="Save" />
    </template>

    <PageTabs v-model="activeTab" @update:model-value="onChangTab">
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
      <PageTab name="license" label="Planos" :icon="BadgeCheck">
        <CompanyPlans />
      </PageTab>
      <PageTab name="users" label="Usuários" :icon="UserCheck">
        <CompanyUsers />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
