<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Button, Input, Label } from '@/components/ui'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { getSituacaoOPColor, getSituacaoOPLabel } from '../types'
import AppContent from '@/components/common/AppContent.vue'
import { formatDateBR } from '@/utils/helpers'
import { Copy } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { loading, item } = storeToRefs(useOrderStore())
const { resetItem, fechCompanyGroupData, fechCompanyData, fetchCategory, fetchAccount } =
  useOrderStore()

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

const showAccountLabel = (account: any) => {
  if (!account.banco) return ''

  if (account.banco == 0) {
    return 'Conta Caixa'
  }
  return `${account.banco} - ${account.agencia} - ${account.conta}`
}

const handleCopy = async () => {
  const boleto = item.value?.boleto?.trim()

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
  <form
    v-if="form"
    class="space-y-4 bg-secondary/40 p-4 rounded-xl"
    @submit.prevent="$emit('submit', form)"
  >
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section class="space-y-4">
        <Input label="OP" :horizontal="true" v-model="form.op" placeholder="op" :disabled="true" />
        <Input
          label="Fatura"
          :horizontal="true"
          v-model="form.fatura"
          placeholder="Fatura"
          :disabled="true"
        />

        <AppLookup
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
          :horizontal="true"
          v-model="form.supplier_id"
          v-model:object="form.supplier"
          label="Fornecedor/Cliente"
          placeholder="Selecione Fornecedor"
          :fetch="fechCompanyData"
          :columns="[
            { key: 'name', label: 'Nome' },
            { key: 'id_fiscal', label: 'ID Fiscal' },
          ]"
        />

        <AppLookup
          v-model="form.financial_category_id"
          v-model:object="form.financial_category"
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

        <AppLookup
          v-model="form.company_accound_id"
          v-model:object="form.account"
          label="Conta"
          horizontal
          :get-label="(u) => showAccountLabel(u)"
          placeholder="Selecione a Conta"
          :fetch="fetchAccount"
          :columns="[
            { key: 'banco', label: 'Banco' },
            { key: 'agencia', label: 'Agencia' },
            { key: 'conta', label: 'Conta' },
          ]"
        />

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

        <AppContent :horizontal="true" label="Situação OP">
          <Badge :class="getSituacaoOPColor(form.situacao_op)">{{
            getSituacaoOPLabel(form.situacao_op)
          }}</Badge>
        </AppContent>

        <div class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
          <h3 class="text-sm font-semibold">Notas</h3>
          <div class="overflow-hidden rounded-lg border border-border/70">
            <table class="w-full text-sm">
              <thead class="bg-muted/70 text-muted-foreground">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold">Nota</th>
                  <th class="px-3 py-2 text-left font-semibold">Emissão</th>
                  <th class="px-3 py-2 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/70">
                <tr
                  class="bg-background hover:bg-muted/40 transition-colors"
                  v-for="fiscaldocument in form.documents"
                >
                  <td class="px-3 py-2 font-medium text-foreground">
                    {{ fiscaldocument.document?.num_document }}
                  </td>
                  <td class="px-3 py-2 text-foreground">
                    {{ formatDateBR(fiscaldocument.document.data_emissao) }}
                  </td>
                  <td class="px-3 py-2 text-right tabular-nums text-foreground">
                    {{ fiscaldocument.document.val_document }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
          <h3 class="text-sm font-semibold">Datas</h3>
          <AppMaskedInput
            v-model="form.data_emissao"
            mask="date"
            label="Emissão"
            :horizontal="true"
          />
          <AppMaskedInput
            v-model="form.data_entrada"
            mask="date"
            label="Entrada"
            :horizontal="true"
          />
          <AppMaskedInput
            v-model="form.data_vencimento"
            mask="date"
            label="Vencimento"
            :horizontal="true"
          />
          <AppMaskedInput
            v-model="form.data_pagamento"
            mask="date"
            label="Pagamento"
            :horizontal="true"
          />
        </div>

        <div class="space-y-3 rounded-lg border border-border bg-background/70 p-3">
          <h3 class="text-sm font-semibold">Valores</h3>
          <AppInputNumber
            :horizontal="true"
            label="Valor Nominal"
            v-model="form.valor_nominal"
            :loading="loading"
            :min="0"
            step="0.01"
          />

          <AppInputNumber
            :horizontal="true"
            label="Valor Juros"
            v-model="form.valor_juros"
            :loading="loading"
            :min="0"
            step="0.01"
          />

          <AppInputNumber
            :horizontal="true"
            label="Valor Desconto"
            v-model="form.valor_desconto"
            :loading="loading"
            :min="0"
            step="0.01"
          />
          <AppInputNumber
            :horizontal="true"
            label="Valor Liquido"
            v-model="form.valor_liquido"
            :loading="loading"
            :min="0"
            step="0.01"
          />
          <AppInputNumber
            :horizontal="true"
            label="Valor Pagamento"
            v-model="form.valor_pagameto"
            :loading="loading"
            :min="0"
            step="0.01"
          />
        </div>
      </section>
    </div>
  </form>
</template>
