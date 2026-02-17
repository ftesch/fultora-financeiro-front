<script setup lang="ts">
import { formatCurrency, formatDateBR } from '@/utils/helpers'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '../storeParcela'
import { Button, Table } from '@/components/ui'
import { ArrowRight } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { loading, documentColumns, pendingDocuments, totalSelectedValue, activePart, movimento } =
  storeToRefs(useDocumentStore())

const { validDataEmissao } = useDocumentStore()

const handleBeforeSelect = (row: any) => {
  const valid = validDataEmissao(row)

  if (!valid) {
    toast.error('Não é possível selecionar documentos com datas de emissão diferentes')
  }
  return valid
}

const selectedDocs = (rows: any[]) => {
  movimento.value.documents = rows
}
</script>

<template>
  <div v-if="pendingDocuments.length > 0">
    <Table
      :columns="documentColumns"
      :data="pendingDocuments"
      density="compact"
      variant="elevated"
      :searchable="false"
      :selectable="true"
      @update:selected="selectedDocs"
      :before-select="handleBeforeSelect"
      class="mt-4"
    >
      <template #cell:data_emissao="{ row }">
        {{ formatDateBR(row.data_emissao) }}
      </template>
      <template #cell:val_document="{ row }">
        {{ formatCurrency(row.val_document) }}
      </template>
      <template #cell:supplier.name="{ row }">
        {{ row.supplier.name }}
      </template>
      <template #cell:supplier.id_fiscal="{ row }">
        {{ row.supplier.id_fiscal }}
      </template>
    </Table>
    <div class="flex items-center justify-between align-middle bg-secondary p-2 rounded-md mt-2">
      <Button
        :icon="ArrowRight"
        label="Avançar"
        @click="activePart = 'complements'"
        :disabled="movimento.documents.length <= 0"
      />
      <div class="font-semibold mr-2">{{ formatCurrency(totalSelectedValue) }}</div>
    </div>
  </div>
</template>
