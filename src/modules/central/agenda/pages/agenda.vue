<script lang="ts" setup>
import type { Column } from '@/components/common/AppTable.vue'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useAgendaStore } from '../store';
import type { Document } from '../types';
import { getSituacaoOPColor, getSituacaoOPLabel } from '../../order/types';
import { formatCurrency, formatDateBR } from '@/utils/helpers';
import { Badge, Button, PageContainer, Table } from '@/components/ui'
import BaixaModal from '../components/BaixaModal.vue';
import { ArrowLeft } from 'lucide-vue-next';

const route = useRoute()

const { loading, documents, company, documentOfPayment } = storeToRefs(useAgendaStore())
const { fetchDataAgenda } = useAgendaStore()

function getParamAsString(param: string | string[] | undefined) {
    return Array.isArray(param) ? param[0] ?? '' : param ?? ''
}

function asDocument(row: Record<string, any>) {
  return row as Document
}

onMounted(async () => {
    const companyId = getParamAsString(route.params.company_id)
    const data = getParamAsString(route.params.data)
    await fetchDataAgenda(companyId, data)
})

const columns: Column[] = [
  {
    key: 'op',
    label: 'OP',
  },
  {
    key: 'situacao_op',
    label: 'Situação',
  },
  {
    key: 'supplier',
    label: 'Fornecedor/Cliente',
  },
  {
    key: 'financial_category',
    label: 'Categoria',
    width: '180px',
    maxWidth: '180px',
  },
  {
    key: 'data_vencimento',
    label: 'Vencimento',
  },
  {
    key: 'data_pagamento',
    label: 'Pagamento',
  },
  {
    key: 'valor_nominal',
    label: 'Valor',
    align: 'right',
  },
]



</script>
<template>
  <PageContainer title="Agenda de Pagamento" :loading="loading">
    <template #actions>
      <Button to="/central/agenda" variant="secondary" :icon="ArrowLeft" label="Voltar" />
    </template>

    <div >
        <div class="flex justify-between font-semibold">
            <span>{{ company?.name }}</span>
            <span>{{ formatDateBR(getParamAsString(route.params.data)) }}</span>
        </div>
        
    </div>
    <Table
      :columns="columns"
      :data="documents"
      has-actions
      density="dense"
      variant="elevated"
      class="mt-4"
    >
      <template #cell:situacao_op="{ row }">
        <Badge :class="getSituacaoOPColor(row.situacao_op)">{{
          getSituacaoOPLabel(row.situacao_op)
        }}</Badge>
      </template>
      <template #cell:supplier="{ row }">
        {{ row.supplier.name }}
      </template>
      <template #cell:financial_category="{ row }">
        <div
          class="max-w-[180px] truncate"
          :title="`${row.financial_category.account}-${row.financial_category.name}`"
        >
          {{ row.financial_category.account }}-{{ row.financial_category.name }}
        </div>
      </template>
      <template #cell:data_vencimento="{ row }">
        {{ formatDateBR(row.data_vencimento) }}
      </template>
      <template #cell:data_pagamento="{ row }">
        {{ formatDateBR(row.data_pagamento) }}
      </template>
      <template #cell:valor_nominal="{ row }">
        {{ formatCurrency(row.valor_nominal) }}
      </template>
      <template #actions="{ row }">
        <BaixaModal v-model="documentOfPayment" :item="asDocument(row)" />
      </template>
    </Table>
  </PageContainer>

</template>
