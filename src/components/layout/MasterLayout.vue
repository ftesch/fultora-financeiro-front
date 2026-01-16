<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navbar -->
    <header class="w-full">
      <AppNavbar @toggle-sidebar="toggleSidebar" :sidebar="{ open: sidebarOpen }" />
    </header>

    <div class="relative h-[calc(100vh-var(--navbar-height,4rem))]">
      <!-- Overlay (mobile) -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="sidebarOpen = false"
      />

      <!-- Layout -->
      <div class="h-full flex">
        <!-- Sidebar -->
        <aside
          class="z-40 m-2 rounded-xl bg-sidebar text-sidebar-foreground shadow-sm transition-all duration-200 overflow-hidden"
          :class="[sidebarOpen ? 'w-64' : 'w-0', 'fixed inset-y-0 left-0 lg:static']"
        >
          <div v-if="sidebarOpen">
            <div class="px-3 py-2 text-lg font-semibold">Dados Mestre</div>

            <nav class="mt-2">
              <SidebarItem to="/master" label="Home" :icon="Home" />
              <SidebarItem to="/master/company" label="Pessoas" :icon="Building2" />
              <SidebarItem to="/master/user" label="Usuários" :icon="Users" />
              <SidebarItem
                to="/master/financial_category"
                label="Categorias Financeiras"
                :icon="Tags"
              />
            </nav>
          </div>
        </aside>

        <!-- Conteúdo -->
        <main class="flex-1 m-2 overflow-auto transition-all duration-200">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppNavbar from '@/components/layout/AppNavbar.vue'
import SidebarItem from '@/components/layout/components/SidebarItem.vue'

import { Home, Building2, Users, Truck, Tags } from 'lucide-vue-next'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>
