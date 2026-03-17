<script setup lang="ts">
import { Button, PageContainer, PageTab, PageTabs } from '@/components/ui'
import AgendaForm from '../components/AgendaForm.vue'
import { useAgendaStore } from '../store'
import { storeToRefs } from 'pinia'
import { ArrowLeft, FileText, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const { updateData, findById } = useAgendaStore()
const { loading, item } = storeToRefs(useAgendaStore())
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
      <Button to="/central/agenda" variant="secondary" :icon="ArrowLeft" label="Voltar" />
      <Button :icon="Save" @click="submit" />
    </template>

    <PageTabs v-model="activeTab">
      <PageTab name="basic" label="Básico" :icon="FileText">
        <AgendaForm :model-value="item" @submit="submit" mode="edit" />
      </PageTab>
    </PageTabs>
  </PageContainer>
</template>
