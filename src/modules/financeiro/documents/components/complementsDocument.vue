<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '../storeParcela'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-vue-next'

const { movimento, activePart } = storeToRefs(useDocumentStore())
const { fetchCondition, fetchCategory, setParcelas } = useDocumentStore()
</script>

<template>
  <div v-if="movimento.documents.length > 0">
    <form class="grid grid-cols-1 gap-2">
      <AppMaskedInput
        v-model="movimento.data_entrada"
        mask="date"
        label="Entrada"
        :horizontal="true"
      />
      <AppLookup
        :disabled="movimento.data_entrada === null"
        v-model="movimento.payment_condition_id"
        v-model:object="movimento.payment_condition"
        label="Condição"
        horizontal
        :get-label="(u) => `${u.title} - ${u.condition} ${u.is_boleto == 1 ? ' (Boleto)' : ''}`"
        placeholder="Selecione a condição de pagamento"
        :fetch="fetchCondition"
        :columns="[
          { key: 'title', label: 'Titulo' },
          { key: 'condition', label: 'Condição' },
        ]"
        @update:object="setParcelas"
      />

      <AppLookup
        :disabled="movimento.data_entrada === null"
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
        ]"
      />
    </form>

    <div class="text-right mt-2">
      <Button
        :icon="ArrowRight"
        label="Avançar"
        @click="activePart = 'lanc'"
        :disabled="movimento.payment_condition == null"
      />
    </div>
  </div>
</template>
