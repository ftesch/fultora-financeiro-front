<script setup lang="ts">
import { AppSelect, Button, PageContainer, WeekAgenda, Progress } from '@/components/ui'
import { useAgendaStore } from '../store'
import { storeToRefs } from 'pinia'
import { Play, Search } from 'lucide-vue-next'
import type { Column } from '@/components/common/AppTable.vue'
import AppLookup from '@/components/common/AppLookup.vue'
import { startOfWeek, endOfWeek, setWeek, format } from 'date-fns';
import { formatCurrency, formatDateBR } from '@/utils/helpers'
import type { Agenda } from '../types'

const currentYear = new Date().getFullYear();
const { fetchData, fechCompanyGroupData } = useAgendaStore()
const { items, loading, criteria } = storeToRefs(useAgendaStore())

const columns: Column[] = [
  {
    key: 'data',
    label: 'Data',
  },
  {
    key: 'day_week',
    label: 'Dia da Semana',
  },
  {
    key: 'valor_apagar',
    label: 'A Pagar',
  },
  {
    key: 'valor_pago',
    label: 'Pago',
  },
]

const weeks = Array.from({ length: 53 }, (_, i) => {
  const weekNumber = i + 1;

  // cria uma data base no ano atual
  const baseDate = new Date(currentYear, 0, 1);

  // define a semana
  const weekDate = setWeek(baseDate, weekNumber, {
    weekStartsOn: 0 // domingo
  });

  const start = startOfWeek(weekDate, { weekStartsOn: 0 });
  const end = endOfWeek(weekDate, { weekStartsOn: 0 });

  return {
    label: `Semana ${String(weekNumber).padStart(2, '0')} (${format(start, 'dd/MM')} - ${format(end, 'dd/MM')})`,
    value: weekNumber
  };
});

const calcWork = (day: Agenda ) => {
  return (day.valor_pago / day.valor_apagar) *100
  
}

</script>

<template>
  <PageContainer title="Agenda" :loading="loading">

    <form @submit.prevent="fetchData">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-3">
          <AppLookup
            :horizontal="true"
            v-model="criteria.company_id"
            v-model:object="criteria.company"
            label="Empresa"
            placeholder="Selecione a Empresa"
            :fetch="fechCompanyGroupData"
            :columns="[
              { key: 'name', label: 'Nome' },
              { key: 'id_fiscal', label: 'ID Fiscal' },
            ]"
          />
        </div>
        <div class="col-span-2">
          <AppSelect 
            :horizontal="true"
            label="Semana",
            v-model="criteria.semana"
            :options="weeks"          
          />
        </div>
        <div class="text-right">
          <Button type="submit" label="Pesquisar" :icon="Search" variant="outline" />
        </div>
      </div>
    </form>

    <div class="mt-4">

      <WeekAgenda :columns="columns" :data="items" has-actions row-key="data" :min-column-width="200"
        class-current-date="border-green-500 bg-green-50 ring-2 ring-green-300 shadow-lg dark:border-green-400 dark:bg-green-800 dark:ring-green-500/50"
        class-after-data="border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/50"

      >
        <template #cell:data="{ value }">
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</p>
          <p class="mt-1 text-base font-bold text-foreground">
            {{ formatDateBR(value) }}
          </p>
        </template>
        <template #cell:day_week="{ value }" >
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dia da Semana</p>
          <p class="mt-1 text-base font-bold text-foreground  border-green-500 border-l-4">
            <span class="ml-2">{{ value }}</span>
          </p>
        </template>

        <template #cell:valor_apagar="{ value }">
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Valor a Pagar</p>
          <p class="mt-1 text-base font-bold text-foreground border-blue-500 border-l-4">
            <span class="ml-2">{{ formatCurrency(value) }}</span>
          </p>
        </template>

        <template #cell:valor_pago="{ value }">
          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Valor Pago</p>
          <p class="mt-1 text-base font-bold text-foreground border-orange-500 border-l-4">
            <span class="ml-2">{{ formatCurrency(value) }}</span>
          </p>
        </template>

        <template #actions="{ row }">
            <Button variant="secondary" :icon="Play" :to="`/central/agenda/${criteria.company_id}/${format(new Date(row.data), 'yyyy-MM-dd')}`"/>
            <Progress :model-value="calcWork(row)"  />
        </template>
      </WeekAgenda>
    </div>
  </PageContainer>
</template>
