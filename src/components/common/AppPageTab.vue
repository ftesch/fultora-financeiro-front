<script setup lang="ts">
import { inject, onMounted, onUnmounted, computed } from 'vue'

type TabContext = {
  register: (tab: { name: string; label: string; icon?: any }) => void
  unregister: (name: string) => void
  activeTab: { value: string }
}

const props = defineProps<{
  name: string
  label: string
  icon?: any
}>()

const context = inject<TabContext>('page-tabs')

if (!context) {
  throw new Error('PageTab must be used inside PageTabs')
}

onMounted(() => {
  context.register({
    name: props.name,
    label: props.label,
    icon: props.icon,
  })
})

onUnmounted(() => {
  context.unregister(props.name)
})

const isActive = computed(() => context.activeTab.value === props.name)
</script>

<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>
