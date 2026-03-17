<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import AgendaForm from '../components/AgendaForm.vue'
import { useAgendaStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import router from '@/router'

const { storeData, resetItem } = useAgendaStore()
const { loading } = storeToRefs(useAgendaStore())

async function submit() {
  await storeData()
  router.push("/central/agenda")
}

onMounted(() => {
  resetItem()
})

const activeTab = ref('basic')

</script>

<template>
  <PageContainer title="Novo Registro" :loading="loading">
    <template #actions>
      <Button to="/central/agenda" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <AgendaForm @submit="submit" mode="create" />
      </PageTab>
    </PageTabs>    
  </PageContainer>
</template>
