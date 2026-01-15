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

  return item.value
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="$emit('submit', form)">
    <Input label="Nome" v-model="form.name" placeholder="name" :disabled="loading" />
    <Input label="Email" v-model="form.email" placeholder="email" :disabled="loading" />
    <Input
      label="Data da Criação"
      v-model="form.created_at"
      placeholder="created_at"
      :disabled="loading"
    />
    <Input
      label="Data de Atualizaçao"
      v-model="form.updated_at"
      placeholder="updated_at"
      :disabled="loading"
    />

    <Button type="submit" :loading="loading"> Salvar </Button>
  </form>
</template>
