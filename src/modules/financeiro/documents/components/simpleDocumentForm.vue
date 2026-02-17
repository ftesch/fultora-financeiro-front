<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input, Switch } from '@/components/ui'
import { useDocumentStore } from '../storeParcela'
import { storeToRefs } from 'pinia'
import AppSelect from '@/components/common/AppSelect.vue'
import AppSwitch from '@/components/common/AppSwitch.vue'
import { useSimpleDocumentStore } from '../storeSimpleDocument'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { Save } from 'lucide-vue-next'
import AppFileInput from '@/components/common/AppFileInput.vue'

const { loading, simpleDocument } = storeToRefs(useSimpleDocumentStore())
const { resetItem, fetchCondition, fechCompanyData, fechCompanyGroupData } =
  useSimpleDocumentStore()

const props = defineProps<{
  mode?: 'create' | 'edit'
}>()
const isEdit = computed(() => props.mode === 'edit')

defineEmits(['submit'])

/**
 * Garante que sempre exista um objeto
 * para bindar no formulário
 */
const form = computed(() => {
  if (!simpleDocument) {
    resetItem()
  }
  return simpleDocument.value!
})
</script>

<template>
  <form
    v-if="form"
    class="space-y-4 gap-3 bg-secondary/40 p-4 rounded-xl"
    @submit.prevent="$emit('submit', form)"
  >
    <AppLookup
      v-model="form.company_id"
      v-model:object="form.company"
      label="Empresa"
      horizontal
      placeholder="Selecione a Empresa"
      :fetch="fechCompanyGroupData"
      :columns="[
        { key: 'name', label: 'Nome' },
        { key: 'id_fiscal', label: 'ID Fiscal' },
      ]"
    />
    <AppLookup
      v-model="form.supplier_id"
      v-model:object="form.supplier"
      label="Fornecedor"
      horizontal
      placeholder="Selecione o Fornecedor"
      :fetch="fechCompanyData"
      :columns="[
        { key: 'name', label: 'Nome' },
        { key: 'id_fiscal', label: 'ID Fiscal' },
      ]"
    />

    <Input :horizontal="true" v-model="form.num_document" label="Numero" :disabled="loading" />

    <AppMaskedInput
      v-model="simpleDocument.data_emissao"
      mask="date"
      label="Emissão"
      :horizontal="true"
    />

    <AppMaskedInput
      v-model="simpleDocument.data_entrada"
      mask="date"
      label="Entrada"
      :horizontal="true"
    />

    <AppInputNumber v-model="simpleDocument.val_document" label="Valor" :horizontal="true" />

    <AppFileInput
      v-model="form.file"
      label="Arquivo"
      horizontal
      placeholder="Arquivo para Upload"
      accept=".pdf,.png,.jpeg,.jpg"
    />

    <hr />
    <Button :icon="Save" type="submit" :loading="loading"> Salvar </Button>
  </form>
</template>
