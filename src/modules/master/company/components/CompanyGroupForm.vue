<script setup lang="ts">
import { Button, Input } from '@/components/ui'
import { useCompanyStore } from '../store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Save } from 'lucide-vue-next'

const { item, loading } = storeToRefs(useCompanyStore())
const { resetGroup, storeGroup } = useCompanyStore()

const form = computed(() => {
  if (!item) {
    resetGroup()
  }
  return item.value!
})

const handleSubmit = async () => {
  await storeGroup()
}
</script>

<template>
  <form v-if="form" class="space-y-4 gap-3 bg-secondary/40 p-4 rounded-xl">
    <Input
      v-model="form.group!.apelido"
      :horizontal="true"
      label="Apelido"
      :disabled="loading"
    />
    <Input
      v-model="form.group!.codigo"
      :horizontal="true"
      label="Código Interno"
      :disabled="loading"
    />

    <Button type="submit" label="Salvar" @click="handleSubmit" :loading="loading" :icon="Save" />
  </form>
</template>
