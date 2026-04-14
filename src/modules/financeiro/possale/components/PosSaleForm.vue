<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui'
import { usePosSaleStore } from '../store'
import { storeToRefs } from 'pinia'
import AppLookup from '@/components/common/AppLookup.vue'
import AppInputNumber from '@/components/common/AppInputNumber.vue'
import AppMaskedInput from '@/components/common/AppMaskedInput.vue'
import { Save } from 'lucide-vue-next'

const { loading, item } = storeToRefs(usePosSaleStore())
const { resetItem, fechCompanyGroupData, initializeCreate } = usePosSaleStore()

const props = defineProps<{
  mode?: 'create' | 'edit'
}>()
const isEdit = computed(() => props.mode === 'edit')

defineEmits(['submit'])

onMounted(async () => {
  if (props.mode === 'create') {
    await initializeCreate()
  }
})

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

const density = ref<'comfortable' | 'compact'>('comfortable')

function toggleDensity() {
  density.value = density.value === 'comfortable' ? 'compact' : 'comfortable'
}
</script>

<template>
  <form
    v-if="form"
    class="space-y-4 gap-3 bg-secondary/40 p-4 rounded-xl"
    @submit.prevent="$emit('submit', form)"
  >
    <AppLookup
      :disabled="mode == 'edit'"
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

    <AppMaskedInput
      v-model="form.date"
      mask="date"
      label="Movimento"
      :horizontal="true"
      :disabled="mode == 'edit'"
    />

    <div class="flex justify-end mb-2">
      <button
        type="button"
        @click="toggleDensity"
        class="text-xs px-3 py-1 rounded-md border hover:bg-muted transition-colors"
      >
        {{ density === 'comfortable' ? 'Compacto' : 'Confortável' }}
      </button>
    </div>

    <div v-if="form.transactions?.length" class="mt-4 border rounded-xl overflow-hidden">
      <div
        v-for="(transaction, index) in form.transactions"
        :key="transaction.payment_method.id"
        :class="[
          'flex items-center justify-between px-4 transition-all',
          density === 'comfortable' ? 'py-3' : 'py-1.5',
          index % 2 === 0 ? 'bg-muted/40' : 'bg-background',
        ]"
      >
        <!-- Categoria -->
        <div class="flex-1 text-sm font-medium truncate pr-4">
          {{ transaction.payment_method.category.account }} -
          {{ transaction.payment_method.category.name }}
        </div>

        <!-- Valor -->
        <div class="w-40">
          <AppInputNumber
            v-model="transaction.valor"
            :disabled="!form.transactions[index]?.can_update"
          />
        </div>
      </div>
    </div>

    <hr />
    <div class="text-right">
      <Button v-if="mode == 'create'" type="submit" :icon="Save" :loading="loading">
        Criar Movimento
      </Button>

      <Button
        v-if="mode == 'edit'"
        type="submit"
        :icon="Save"
        :loading="loading"
        class="bg-amber-300"
      >
        Alterar Movimento
      </Button>
    </div>
  </form>
</template>
