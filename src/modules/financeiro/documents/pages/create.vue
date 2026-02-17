<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '../storeParcela'
import { Button, PageContainer } from '@/components/ui'
import { ArrowLeftCircle } from 'lucide-vue-next'
import { Settings, Shield, Database, ListCheck } from 'lucide-vue-next'
import FilterDocuments from '../components/filterDocuments.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import SelectDocuments from '../components/selectDocuments.vue'
import LancParcelas from '../components/lancParcelas.vue'
import ComplementsDocument from '../components/complementsDocument.vue'

const { loading, activePart } = storeToRefs(useDocumentStore())
</script>
<template>
  <PageContainer title="Lançar Parcelas" :loading="loading">
    <template #actions>
      <Button variant="outline" label="Voltar" :icon="ArrowLeftCircle" to="/financeiro/documents" />
    </template>

    <AppAccordion
      type="single"
      v-model="activePart"
      :items="[
        { value: 'search', title: 'Selecionar Fornecedor', icon: Settings, showChevron: false },
        { value: 'select', title: 'Selecionar Documentos', icon: Shield, showChevron: false },
        {
          value: 'complements',
          title: 'Dados Complementares',
          icon: ListCheck,
          showChevron: false,
        },
        { value: 'lanc', title: 'Larçar parcelas', icon: Database, showChevron: false },
      ]"
    >
      <template #content.search>
        <FilterDocuments class="mt-4" />
      </template>
      <template #content.select>
        <SelectDocuments class="mt-4" />
      </template>
      <template #content.complements>
        <ComplementsDocument class="mt-4" />
      </template>
      <template #content.lanc>
        <LancParcelas class="mt-4" />
      </template>
    </AppAccordion>
  </PageContainer>
</template>
