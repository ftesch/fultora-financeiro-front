<script setup lang="ts">
import AppLookup from '@/components/common/AppLookup.vue'
import { usePosSaleStore } from '../store'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui'
import { ArrowBigLeft, ArrowBigRight, Eraser, Search } from 'lucide-vue-next'
import AppSelect from '@/components/common/AppSelect.vue'

const { fechCompanyGroupData, fetchData, resetCriteria } = usePosSaleStore()
const { criteria } = storeToRefs(usePosSaleStore())

const handlePage = (fator: number) => {
  criteria.value.page = criteria.value.page + fator
  fetchData()
}
</script>

<template>
  <form @submit.prevent="fetchData">
    <div class="grid grid-cols-2 gap-4">
      <AppMaskedInput
        v-model="criteria.start_date"
        mask="date"
        label="Data Inicio"
        :horizontal="true"
      />
      <AppMaskedInput
        v-model="criteria.end_date"
        mask="date"
        label="Data Inicio"
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
