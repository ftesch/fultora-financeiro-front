<script setup lang="ts">
import AppLookup from '@/components/common/AppLookup.vue'
import { ref } from 'vue'
import { useSimpleDocumentStore } from '../storeSimpleDocument'
import { Button } from '@/components/ui'
import { Search } from 'lucide-vue-next'
import { useDocumentStore } from '../storeParcela'
import { storeToRefs } from 'pinia'

const { fechCompanyData, fechCompanyGroupData } = useSimpleDocumentStore()

const { getPendingDocuments, searchDocument } = useDocumentStore()
const { loading } = storeToRefs(useDocumentStore())
</script>

<template>
  <div class="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
    <AppLookup
      v-model="searchDocument.company_id"
      v-model:object="searchDocument.company"
      label="Empresa"
      placeholder="Selecione a Empresa"
      :fetch="fechCompanyGroupData"
      :columns="[
        { key: 'name', label: 'Nome' },
        { key: 'id_fiscal', label: 'ID Fiscal' },
      ]"
    />
    <AppLookup
      v-model="searchDocument.supplier_id"
      v-model:object="searchDocument.supplier"
      label="Fornecedor"
      placeholder="Selecione o Fornecedor"
      :fetch="fechCompanyData"
      :columns="[
        { key: 'name', label: 'Nome' },
        { key: 'id_fiscal', label: 'ID Fiscal' },
      ]"
    />
    <Button
      class="w-12 mt-7"
      :icon="Search"
      :loading="loading"
      variant="outline"
      @click="getPendingDocuments"
    />
  </div>
</template>
