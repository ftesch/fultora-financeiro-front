<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input, Switch } from '@/components/ui'
import { usePaymentConditionStore } from '../store'
import { storeToRefs } from 'pinia'
import AppSelect from '@/components/common/AppSelect.vue'
import AppSwitch from '@/components/common/AppSwitch.vue'

const { loading, item } = storeToRefs(usePaymentConditionStore())
const { resetItem } = usePaymentConditionStore()

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
    <Input :horizontal="true" v-model="form.title" label="Titulo" :disabled="loading" />

    <Input
      label="Condição Pagamento"
      :horizontal="true"
      v-model="form.condition"
      placeholder="30/60/90"
      :disabled="loading"
    />

    <AppSelect
      label="Inicia em:"
      v-model="form.start_in"
      :horizontal="true"
      :options="[
        { label: 'Na Entrada', value: 'entrance' },
        { label: 'Na Emissão', value: 'emission' },
        { label: 'No Lançamento', value: 'create' },
      ]"
    />

    <AppSwitch
      label="Boleto?"
      v-model="form.is_boleto"
      :horizontal="true"
      :true-value="1"
      :false-value="0"
    />

    <AppSwitch
      label="Ativo?"
      v-model="form.active"
      :horizontal="true"
      :true-value="1"
      :false-value="0"
    />

    <hr />
    <Button type="submit" :loading="loading"> Salvar </Button>
  </form>
</template>
