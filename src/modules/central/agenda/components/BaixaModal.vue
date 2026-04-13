<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Document } from '../types'
import { Button, Dialog, Input } from '@/components/ui'
import AppLookup from '@/components/common/AppLookup.vue'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppFileInput from '@/components/common/AppFileInput.vue'
import AppContent from '@/components/common/AppContent.vue'
import { storeToRefs } from 'pinia'
import { useAgendaStore } from '../store'
import { SituacaoOP } from '../../order/types'
import { BanknoteArrowDownIcon, Copy, Download } from 'lucide-vue-next'
import { formatCurrency, formatDateBR } from '@/utils/helpers'
import { toast } from 'vue-sonner'

const props = defineProps<{
  item: Document
}>()

const model = defineModel<Document | null>({
  default: null,
})

const open = ref(false)

const { loading } = storeToRefs(useAgendaStore())
const { setDocument, settlement, fetchAccount, downloadComprovante } = useAgendaStore()

const form = computed(() => model.value)

function showAccountLabel(account: any) {
  if (!account?.banco && account?.type) return account.type

  if (account?.banco == 0) {
    return 'Conta Caixa'
  }

  if (account.banco == null && account.agenia == null && account.conta == null) {
    return ''
  }

  return `${account?.banco} - ${account?.agencia} - ${account?.conta}`
}

function handleOpen() {
  setDocument(props.item)
  open.value = true
}

function handleClose() {
  open.value = false
  model.value = null
}

function handleOpenChange(value: boolean) {
  if (value) {
    open.value = true
    return
  }

  handleClose()
}

async function handleSettlement() {
  await settlement()
  handleClose()
}

async function handleDownloadComprovante() {
  await downloadComprovante()
}

const handleCopy = async () => {
  const boleto = form.value?.boleto?.trim()

  if (!boleto) {
    toast.error('Boleto não disponível para cópia')
    return
  }

  try {
    await navigator.clipboard.writeText(boleto)
    toast.success('Boleto copiado para a área de transferência')
  } catch {
    toast.error('Não foi possível copiar o boleto')
  }
}

</script>

<template>
  <Button
    size="sm"
    variant="secondary"
    :icon="BanknoteArrowDownIcon"
    @click="handleOpen"
  />

  <Dialog
    :open="open"
    title="Baixa"
    description="Informe os dados para registrar o pagamento"
    size="medium"
    @cancel="handleClose"
    @update:open="handleOpenChange"
  >
    <div v-if="form" class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
      <div class="rounded-xl border border-border bg-muted/30 p-3">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AppContent label="OP" :horizontal="true">
                <span class="text-sm font-medium">{{ form.op || '-' }}</span>
            </AppContent>

            <AppContent label="Fatura" :horizontal="true">
                <span class="text-sm font-medium">{{ form.fatura || '-' }}</span>
            </AppContent>

            <div class="col-span-2">

                <AppContent label="Fornecedor" :horizontal="true">
                    <span class="text-sm font-medium">{{ form.supplier?.name || '-' }}</span>
                </AppContent>
            </div>


            <AppContent label="Valor Nominal" :horizontal="true">
                <span class="text-sm font-medium">{{ formatCurrency(form.valor_nominal) }}</span>
            </AppContent>

          <AppContent label="Data Emissão" :horizontal="true">
            <span class="text-sm font-medium">{{ formatDateBR(form.data_emissao) || '-' }}</span>
          </AppContent>

          <AppContent label="Data Entrada" :horizontal="true">
            <span class="text-sm font-medium">{{ formatDateBR(form.data_entrada) || '-' }}</span>
          </AppContent>

          <AppContent label="Data Vencimento" :horizontal="true">
            <span class="text-sm font-medium">{{ formatDateBR(form.data_vencimento) || '-' }}</span>
          </AppContent>
        </div>
      </div>

    <Input
        label="Boleto"
        :horizontal="true"
        v-model="form.boleto"
        placeholder="boleto"
        :disabled="true"
        >
        <template #suffix>
            <Button
            :icon="Copy"
            size="sm"
            variant="ghost"
            class="size-4"
            type="button"
            @click="handleCopy()"
            />
        </template>
    </Input>


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
  </Dialog>
</template>
