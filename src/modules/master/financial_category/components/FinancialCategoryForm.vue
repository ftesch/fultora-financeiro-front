<script setup lang="ts">
import { computed } from 'vue'
import { AppSelect, Button, Input } from '@/components/ui'
import { useFinancialCategoryStore } from '../store'
import { storeToRefs } from 'pinia'
import AppLookup from '@/components/common/AppLookup.vue'
import { Save } from 'lucide-vue-next'

const { loading, item } = storeToRefs(useFinancialCategoryStore())
const { resetItem, fechOnlyData } = useFinancialCategoryStore()

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
  if (!item) {
    resetItem()
  }
  return item.value!
})
</script>

<template>
  <form
    v-if="form"
    class="space-y-4 gap-3 bg-secondary/40 p-4 rounded-xl"
    @submit.prevent="$emit('submit', form)"
  >
    <Input
      :horizontal="true"
      label="Conta"
      v-model="form.account"
      placeholder="Conta"
      :disabled="loading"
    />
    <Input :horizontal="true" v-model="form.name" label="Nome da Conta" :disabled="loading" />
    <AppSelect
      label="Tipo da Conta"
      :horizontal="true"
      :options="[
        { label: 'Devedora (Debito)', value: 'D' },
        { label: 'Credora (Credito)', value: 'C' },
        { label: 'Conta Sintética', value: 'S' },
      ]"
      v-model="form.type"
      :disabled="loading"
    />

    <AppLookup
      v-model="form.financial_category_id"
      v-model:object="form.financial_parent"
      label="Categoria Pai"
      horizontal
      placeholder="Selecione uma Categoria Pai"
      :fetch="fechOnlyData"
      :columns="[
        { key: 'account', label: 'Conta' },
        { key: 'name', label: 'Nome' },
      ]"
    />

    <hr />
    <Button type="submit" :loading="loading" label="Salvar" :icon="Save" />
  </form>
</template>
