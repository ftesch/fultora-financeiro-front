<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input } from '@/components/ui'
import { useCashStore } from '../store'
import { storeToRefs } from 'pinia'
import AppLookup from '@/components/common/AppLookup.vue'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import { Eraser, Save } from 'lucide-vue-next'

const { loading, movimento } = storeToRefs(useCashStore())
const { resetMovimento, fechCompanyGroupData, fechCompanyData, fetchCategory } = useCashStore()

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
  if (!movimento) {
    resetMovimento()
  }
  return movimento.value!
})
</script>

<template>
  <form
    v-if="form"
    class="space-y-4 gap-3 bg-secondary/40 p-4 rounded-xl"
    @submit.prevent="$emit('submit', form)"
  >
    <AppLookup
      :disabled="mode == 'edit'"
      :horizontal="true"
      v-model="form.company_id"
      v-model:object="form.company"
      label="Empresa"
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

    <AppLookup
      v-model="movimento.financial_category_id"
      v-model:object="movimento.financial_category"
      label="Categoria"
      horizontal
      :get-label="(u) => `${u.account} - ${u.name}`"
      placeholder="Selecione a Categoria Financeira"
      :fetch="fetchCategory"
      :columns="[
        { key: 'account', label: 'Conta' },
        { key: 'name', label: 'Nome' },
        { key: 'type', label: 'Tipo' },
      ]"
    />

    <AppMaskedInput
      v-model="form.date"
      mask="date"
      label="Data"
      :horizontal="true"
      :disabled="mode == 'edit'"
    />

    <AppInputNumber
      :horizontal="true"
      label="Valor"
      v-model="form.valor"
      :loading="loading"
      :min="0"
      step="0.01"
    />

    <hr />
    <Button
      type="button"
      :loading="loading"
      @click="resetMovimento"
      :icon="Eraser"
      class="bg-amber-300"
    />
    <Button type="submit" :loading="loading" :icon="Save" class="ml-2"> Salvar </Button>
  </form>
</template>
