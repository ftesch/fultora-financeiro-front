<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input } from '@/components/ui'
import { useAgendaStore } from '../store'
import { storeToRefs } from 'pinia'


const { loading, item } = storeToRefs(useAgendaStore())
const { resetItem } = useCompanyStore()

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
    <Input
      :horizontal="true" 
      v-model="form.data"
      placeholder="data"
      :disabled="loading"
    />
    <Input
      :horizontal="true" 
      v-model="form.valor_apagar"
      placeholder="valor_apagar"
      :disabled="loading"
    />
    <Input
      :horizontal="true" 
      v-model="form.valor_atrasado"
      placeholder="valor_atrasado"
      :disabled="loading"
    />
    <Input
      :horizontal="true" 
      v-model="form.valor_pago"
      placeholder="valor_pago"
      :disabled="loading"
    />

    <Button type="submit" :loading="store.loading">
      Salvar
    </Button>
  </form>
</template>
