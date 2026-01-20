<script setup lang="ts">
import { provide, ref, computed } from 'vue'

type TabItem = {
  name: string
  label: string
  icon?: any
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const tabs = ref<TabItem[]>([])

const activeTab = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function register(tab: TabItem) {
  if (!tabs.value.find((t) => t.name === tab.name)) {
    tabs.value.push(tab)
  }
}

function unregister(name: string) {
  tabs.value = tabs.value.filter((t) => t.name !== name)
}

provide('page-tabs', {
  register,
  unregister,
  activeTab,
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
    <!-- Menu lateral -->
    <aside class="space-y-1">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="activeTab = tab.name"
        :class="[
          'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition',
          activeTab === tab.name
            ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-l-green-500'
            : 'hover:bg-secondary',
        ]"
      >
        <component v-if="tab.icon" :is="tab.icon" class="h-4 w-4" />
        <span>{{ tab.label }}</span>
      </button>
    </aside>

    <!-- Conteúdo -->
    <section class="min-w-0">
      <slot />
    </section>
  </div>
</template>
