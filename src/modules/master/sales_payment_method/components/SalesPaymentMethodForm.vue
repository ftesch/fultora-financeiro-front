<script setup lang="ts">
import { computed } from 'vue'
import { AppSelect, Button, Input } from '@/components/ui'
import { useSalesPaymentMethodStore } from '../store'
import { storeToRefs } from 'pinia'
import AppLookup from '@/components/common/AppLookup.vue'
import AppSwitch from '@/components/common/AppSwitch.vue'
import { Save } from 'lucide-vue-next'
import AppInputNumber from '@/components/common/AppInputNumber.vue'

const { loading, item } = storeToRefs(useSalesPaymentMethodStore())
const { resetItem, fechCategoryData, fechCompanyData } = useSalesPaymentMethodStore()

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
    <Input label="Ordem" :horizontal="true" v-model="form.order" :disabled="loading" />

    <AppLookup
      v-model="form.category_id"
      v-model:object="form.category"
      label="Categoria"
      horizontal
      placeholder="Selecione a Categoria"
      :fetch="fechCategoryData"
      :columns="[
        { key: 'account', label: 'Conta' },
        { key: 'name', label: 'Nome' },
      ]"
    />

    <AppLookup
      v-model="form.acquirer_id"
      v-model:object="form.acquirer"
      label="Adquirente (opcional)"
      horizontal
      placeholder="Selecione o Adquiriente"
      :fetch="fechCompanyData"
      :columns="[
        { key: 'name', label: 'Nome' },
        { key: 'id_fiscal', label: 'ID Fiscal' },
      ]"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppSelect
        v-model="form.payment_method"
        label="Método"
        :disabled="loading"
        :horizontal="true"
        :options="[
          { label: 'Dinheiro', value: 'dinheiro' },
          { label: 'Cartão Debito', value: 'cartao_debito' },
          { label: 'Cartão Credito', value: 'cartao_credito' },
          { label: 'Carteira Digital', value: 'carteira_digital' },
          { label: 'Pix', value: 'pix' },
          { label: 'Boleto', value: 'boleto' },
          { label: 'Devolução', value: 'devolucao' },
          { label: 'Convênio', value: 'convenio' },
        ]"
      />
      <AppSelect
        v-model="form.payment_term_options"
        label="Dias Recebimento"
        :disabled="loading"
        :horizontal="true"
        :options="[
          { label: 'Dias Úteis', value: 'diasuteis' },
          { label: 'Dias Corridos', value: 'diascorridos' },
          { label: 'Dia do Mês', value: 'diadomes' },
        ]"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppInputNumber
        label="Dias"
        :horizontal="true"
        v-model="form.payment_term_days"
        :decimals="0"
        :disabled="loading"
      />

      <AppInputNumber
        label="Taxa"
        :horizontal="true"
        v-model="form.payment_tax"
        :decimals="2"
        :disabled="loading"
      />
    </div>
    <AppSwitch
      label="Ativo"
      :horizontal="true"
      v-model="form.active"
      :true-value="1"
      :false-value="0"
    />

    <div class="border-t-2">
      <Button class="mt-2" type="submit" :loading="loading" :icon="Save"> Salvar </Button>
    </div>
  </form>
</template>
