import { computed, ref, watch } from 'vue'

const sidebar = ref<'open' | 'close'>(
  (localStorage.getItem('sidebar') as 'open' | 'close') || 'open',
)

export function useSidebar() {
  watch(sidebar, (value) => {
    localStorage.setItem('sidebar', value)
  })

  const toggleSidebar = () => {
    sidebar.value = sidebar.value === 'open' ? 'close' : 'open'
  }

  const isSidebarOpen = computed(() => sidebar.value === 'open')

  return {
    sidebar,
    toggleSidebar,
    isSidebarOpen,
  }
}
