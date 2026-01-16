<script setup lang="ts">
import { computed } from 'vue'
import { Button, Input } from '@/components/ui'
import { useUserStore } from '../store'
import { storeToRefs } from 'pinia'

const { item, loading } = storeToRefs(useUserStore())

defineEmits(['submit'])

const form = computed(() => {
  if (!item.value) {
    item.value = {} as any
  }

  return item.value!
})
</script>

<template>
  <form class="space-y-4 bg-secondary/40 p-4 rounded-xl" @submit.prevent="$emit('submit', form)">
    <Input label="Nome" v-model="form.name" :horizontal="true" :disabled="loading" />
    <Input label="Email" v-model="form.email" :horizontal="true" :disabled="loading" />

    <Button type="submit" :loading="loading"> Salvar </Button>
  </form>
</template>
