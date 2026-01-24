<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input, MasketInput, AppSelect } from '@/components/ui'
import { useCompanyStore } from '../store'
import { Save, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const { item, loading } = storeToRefs(useCompanyStore())
const { resetItem, searchCEP } = useCompanyStore()

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
    <MasketInput
      v-model="form.id_fiscal"
      label="ID Fiscal"
      placeholder="ID Fiscal"
      :disabled="loading || isEdit"
      mask="cpf-cnpj"
      :horizontal="true"
    />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AppSelect
        v-model="form.type_person"
        label="Tipo da Pessoa"
        :disabled="loading || isEdit"
        :horizontal="true"
        :options="[
          { label: 'Física', value: 'F' },
          { label: 'Jurídica', value: 'J' },
        ]"
      />

      <AppSelect
        v-model="form.type_entity"
        label="Tipo da Entidade"
        :disabled="loading || isEdit"
        :horizontal="true"
        :options="[
          { label: 'Grupo Empresarial', value: 'business_group' },
          { label: 'Fornecedor ou Cliente', value: 'partner' },
          { label: 'Colaborador', value: 'employee' },
          { label: 'Licenciamento', value: 'licensor' },
        ]"
      />
    </div>

    <Input
      v-model="form.name"
      :horizontal="true"
      label="Nome"
      placeholder="Nome"
      :disabled="loading || isEdit"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="form.email"
        :horizontal="true"
        label="Email"
        placeholder="Email"
        :disabled="loading"
      />
      <MasketInput
        :horizontal="true"
        v-model="form.phone"
        label="Telefone"
        placeholder="Telefone"
        mask="phone"
        :disabled="loading"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input v-model="form.cep" label="CEP" inputmode="numeric" :horizontal="true">
        <template #suffix>
          <Button type="button" size="icon" variant="ghost" @click="searchCEP()">
            <Search class="h-4 w-4" />
          </Button>
        </template>
      </Input>

      <Input v-model="form.endereco" :horizontal="true" label="Endereço" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input v-model="form.numero" label="Numero" :horizontal="true" />
      <Input v-model="form.complemento" label="Complemento" :horizontal="true" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input v-model="form.bairro" label="Bairro" :horizontal="true" />
      <Input v-model="form.cidade" label="Cidade" :horizontal="true" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input v-model="form.estado" label="Estado" :horizontal="true" />
      <Input v-model="form.id_ibge" label="ID Ibge" :horizontal="true" />
    </div>

    <hr />
    <Button type="submit" :loading="loading" :icon="Save"> Salvar </Button>
  </form>
</template>
