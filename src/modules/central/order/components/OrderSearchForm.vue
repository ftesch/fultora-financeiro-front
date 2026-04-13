<script setup lang="ts">
import AppLookup from '@/components/common/AppLookup.vue'
import { useOrderStore } from '../store'
import { storeToRefs } from 'pinia'
import { AppCalendar, Button } from '@/components/ui'
import { ArrowBigLeft, ArrowBigRight, Eraser, Search } from 'lucide-vue-next'
import AppSelect from '@/components/common/AppSelect.vue'

const { fechCompanyGroupData, fechCompanyData, fetchCategory, fetchData, resetCriteria } =
  useOrderStore()
const { criteria } = storeToRefs(useOrderStore())

const handlePage = (fator: number) => {
  criteria.value.page = criteria.value.page + fator
  fetchData()
}

</script>

<template>
  <form @submit.prevent="fetchData">
    <div class="grid grid-cols-2 gap-4">

      <AppCalendar
        v-model="criteria.data_entrada"
        mode="range"
        label="Data de Entrada"
        :horizontal="true"
      />
      <AppCalendar
        v-model="criteria.data_lancamento"
        mode="range"
        label="Data de Lançamento"
        :horizontal="true"
      />
      <AppCalendar
        v-model="criteria.data_vencimento"
        mode="range"
        label="Data de Vencimento"
        :horizontal="true"
      />
      <AppCalendar
        v-model="criteria.data_pagamento"
        mode="range"
        label="Data de Pagamento"
        :horizontal="true"
      />
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
      <AppLookup
        :horizontal="true"
        v-model="criteria.supplier_id"
        v-model:object="criteria.supplier"
        label="Fornecedor/Cliente"
        placeholder="Selecione Fornecedor"
        :fetch="fechCompanyData"
        :columns="[
          { key: 'name', label: 'Nome' },
          { key: 'id_fiscal', label: 'ID Fiscal' },
        ]"
      />

      <AppLookup
        v-model="criteria.financial_category_id"
        v-model:object="criteria.financial_category"
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

      <div class="flex items-end justify-end gap-2">
        <div class="w-18">
          <AppSelect
            v-model="criteria.per_page"
            :options="[
              { label: '10', value: 10 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]"
          />
        </div>
        <div clas="w-32">
          <Button :icon="ArrowBigLeft" variant="outline" @click="handlePage(-1)" type="button" />
          <Button :icon="ArrowBigRight" variant="outline" @click="handlePage(1)" type="button" />
        </div>
        <Button type="button" :icon="Eraser" @click="resetCriteria" variant="outline" />
        <Button type="submit" label="Pesquisar" :icon="Search" variant="outline" />
      </div>
    </div>
  </form>
</template>
