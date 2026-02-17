<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '../storeParcela'
import { AppUploadXMLDocument } from '@/components/common/XmlUpload'
import { Button, Table } from '@/components/ui'
import { FileInput, Hand, RefreshCcw } from 'lucide-vue-next'
import { formatCurrency, formatDateBR } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import FilterDocuments from '../components/filterDocuments.vue'
import SimpleDocumentForm from '../components/simpleDocumentForm.vue'

const onUploaded = async () => {
  await getPendingDocuments()
}
const onError = () => {
  toast.error('Houve falha no upload do XML')
}

const { loading, pendingDocuments, selectedDocuments, documentColumns } =
  storeToRefs(useDocumentStore())
const { getPendingDocuments } = useDocumentStore()
</script>

<template>
  <PageContainer title="Categoria Financeira" :loading="loading">
    <div class="flex justify-end">
      <Button
        class="ml-2"
        variant="outline"
        label="Lançar Parcelas"
        :loading="loading"
        :icon="FileInput"
        to="/financeiro/documents/create"
      />
    </div>
    <div class="mt-2">
      <div class="p-4 bg-secondary rounded-2xl">
        <span class="font-semibold">Upload de XML</span>
      </div>
      <AppUploadXMLDocument
        class="mt-2"
        action="/api/financeiro/documents/uploadXml"
        :maxSizeMb="4"
        @uploaded="onUploaded"
        @error="onError"
      />
    </div>

    <div class="mt-4">
      <div class="p-4 bg-secondary rounded-2xl">
        <span class="font-semibold">Entrada manual</span>
      </div>
      <SimpleDocumentForm class="mt-2" />
    </div>
  </PageContainer>
</template>
