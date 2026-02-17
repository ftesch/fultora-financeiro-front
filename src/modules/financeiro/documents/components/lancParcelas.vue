<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '../storeParcela'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import { formatCurrency } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import { Button, Input } from '@/components/ui'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import { Save } from 'lucide-vue-next'

const { movimento, totalParcelasValue, totalSelectedValue, loading } =
  storeToRefs(useDocumentStore())

const { storeDocument } = useDocumentStore()

function handleBoleto(
  data: { bank: string; dueDate: string | null; amount: number | null },
  index: number,
) {
  const parcela = movimento.value.parcelas[index]
  if (!parcela) return

  if (data.dueDate !== parcela.data_vencimento) {
    toast.error('Data de Vencimento Incorreta')
  }

  if (data.amount !== parcela?.valor_parcela) {
    toast.error('Valor da Parcela Incorreto')
  }
}
</script>

<template>
  <div v-if="movimento.documents.length > 0">
    <div class="p-4 bg-secondary rounded-2xl flex items-center justify-between">
      <span class="font-semibold">Total de Parcelas</span>
      <div class="font-semibold mr-2">{{ formatCurrency(totalSelectedValue) }}</div>
    </div>

    <div v-if="movimento.payment_condition_id">
      <form class="bg-secondary p-2 rounded-md mt-2">
        <div
          v-for="(parcela, index) in movimento.parcelas"
          :key="index"
          class="grid gap-2 mt-2 items-end grid-cols-1 sm:grid-cols-[120px_1fr_130px_120px]"
        >
          <!-- Fatura (pequeno) -->
          <Input label="Fatura" v-model="parcela.fatura" :loading="loading" />

          <!-- Boleto (principal) -->
          <!-- <Input label="Boleto" v-model="parcela.boleto" :loading="loading" autofocus /> -->
          <AppMaskedInput
            label="Boleto"
            v-model="parcela.boleto"
            mask="boleto"
            :loading="loading"
            autofocus
            @boletoData="(data) => handleBoleto(data, index)"
          />

          <!-- Vencimento -->
          <AppMaskedInput
            label="Vencimento"
            v-model="parcela.data_vencimento"
            mask="date"
            :loading="loading"
          />

          <!-- Valor -->
          <AppInputNumber
            label="Valor"
            v-model="parcela.valor_parcela"
            :loading="loading"
            :min="0"
            step="0.01"
          />
        </div>
      </form>
      <div
        class="flex justify-between p-2 rounded-md mt-2"
        :class="totalParcelasValue == totalSelectedValue ? 'bg-secondary' : 'bg-amber-800'"
      >
        <Button
          :icon="Save"
          variant="outline"
          label="Salvar Parcelas"
          class="h-6"
          @click="storeDocument"
          :disabled="totalParcelasValue !== totalSelectedValue"
        />
        <span class="font-semibold mr-2">{{ formatCurrency(totalParcelasValue) }}</span>
      </div>
    </div>
  </div>
</template>
