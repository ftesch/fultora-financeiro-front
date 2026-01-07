<template>
  <div class="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
    <h3 class="text-lg font-semibold">
      <div class="flex">
        <component :is="module.icon" class="size-6" />
        <span class="ml-2">{{ module.name }}</span>
      </div>
    </h3>

    <div class="mt-4 flex justify-end">
      <Button size="sm" @click="go"> Acessar </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui'
import router from '@/router'
import type { Module } from '@/types/auth'

const props = defineProps<{
  module: Module
}>()

const go = () => {
  router.push(props.module.route)
}
</script>
