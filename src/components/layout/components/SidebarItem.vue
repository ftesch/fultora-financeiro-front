<template>
  <RouterLink
    :to="to"
    class="flex items-center rounded-md px-2 py-2 mt-1 mr-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    :class="{
      'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-l-green-500': isActive,
    }"
  >
    <!-- Ícone (opcional) -->
    <component v-if="icon" :is="icon" class="h-4 w-4 shrink-0" />

    <span class="truncate ml-2">
      {{ label }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  to: string
  label: string
  icon?: Component
}>()

const route = useRoute()

const isActive = computed(() => route.path.startsWith(props.to))
</script>
