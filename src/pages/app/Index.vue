<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'
const { getModules } = storeToRefs(useAuthStore())
import router from '@/router'
import { storeToRefs } from 'pinia'

onMounted(() => {
  if (getModules.value?.length == 1) {
    router.push({ name: 'marketplace' })
  }
})
</script>
