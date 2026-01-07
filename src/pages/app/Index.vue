<template>
  <div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ModuleCard v-for="module in modules" :module="module" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import router from '@/router'
import { storeToRefs } from 'pinia'
import ModuleCard from '@/components/App/ModuleCard.vue'
import { useModulesStore } from '@/stores/module'

const { modules } = storeToRefs(useModulesStore())

onMounted(() => {
  if (modules.value?.length == 1) {
    router.push({ name: 'marketplace' })
  }
})
</script>
