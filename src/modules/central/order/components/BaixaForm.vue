<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { BanknoteArrowDownIcon, Download } from 'lucide-vue-next'
import AppFileInput from '@/components/common/AppFileInput.vue'
import { SituacaoOP } from '../types'
import AppContent from '@/components/common/AppContent.vue'

const { loading, item } = storeToRefs(useOrderStore())
const { resetItem, settlement, fetchAccount, downloadComprovante } = useOrderStore()

const handleSettlement = async () => {
  await settlement()
}

const handleDownloadComprovante = async () => {
  await downloadComprovante()
}

const form = computed(() => {
  if (!item) {
    resetItem()
  }
  return item.value!
})

const showAccountLabel = (account: any) => {
  if (!account.banco && account.type) return account.type

  if (account.banco == 0) {
    return 'Conta Caixa'
  }
  return `${account.banco} - ${account.agencia} - ${account.conta}`
}
</script>
<template>
  <div class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
    <h3 class="text-sm font-semibold bg-background/80 p-2 rounded-2xl">Baixa</h3>
    <AppLookup
      :disabled="form.situacao_op == SituacaoOP.PAID"
      v-model="form.company_account_id"
      v-model:object="form.account"
      label="Conta"
      horizontal
      :get-label="(u) => showAccountLabel(u)"
      placeholder="Selecione a Conta"
      :fetch="fetchAccount"
      :columns="[
        { key: 'type', label: 'Tipo' },
        { key: 'banco', label: 'Banco' },
        { key: 'agencia', label: 'Agencia' },
        { key: 'conta', label: 'Conta' },
      ]"
    />
    <AppMaskedInput
      :disabled="form.situacao_op == SituacaoOP.PAID"
      v-model="form.data_pagamento"
      mask="date"
      label="Pagamento"
      :horizontal="true"
    />
    <AppInputNumber
      :disabled="form.situacao_op == SituacaoOP.PAID"
      :horizontal="true"
      label="Valor Pagamento"
      v-model="form.valor_pagamento"
      :loading="loading"
      :min="0"
      step="0.01"
    />
    <AppFileInput
      v-if="form.situacao_op == SituacaoOP.OPEN"
      v-model="form.comprovante"
      label="Comprovante"
      horizontal
      placeholder="Arquivo para Upload"
      accept=".pdf,.png,.jpeg,.jpg"
    />
    <div v-if="form.situacao_op == SituacaoOP.PAID">
      <AppContent label="Comprovante" :horizontal="true">
        <Button
          :icon="Download"
          size="sm"
          type="button"
          :disabled="loading || !form.path_comprovante"
          @click="handleDownloadComprovante"
        />
      </AppContent>
    </div>
    <div class="flex justify-end" v-if="form.situacao_op == SituacaoOP.OPEN">
      <Button
        label="Baixa"
        :icon="BanknoteArrowDownIcon"
        class="bg-amber-400"
        @click="handleSettlement"
      />
    </div>
  </div>
</template>
