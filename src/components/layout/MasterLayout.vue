<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navbar -->
    <header class="w-full">
      <AppNavbar @toggle-sidebar="toggleSidebar" :sidebar="{ open: isSidebarOpen }" />
    </header>

    <div class="relative h-[calc(100vh-var(--navbar-height,4rem))]">
      <!-- Overlay (mobile) -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="isSidebarOpen = false"
      />

      <!-- Layout -->
      <div class="h-full flex">
        <!-- Sidebar -->
        <aside
          class="z-40 m-2 m-rounded-xl bg-sidebar text-sidebar-foreground shadow-sm transition-all duration-200 overflow-hidden"
          :class="[isSidebarOpen ? 'w-64' : 'w-0', 'fixed inset-y-0 left-0 lg:static']"
        >
          <div v-if="isSidebarOpen">
            <div class="px-3 py-1 text-lg font-semibold">Dados Mestre</div>

            <nav>
              <SidebarItem to="/master/home" label="Home" :icon="Home" />
              <SidebarItem to="/master/company" label="Pessoas" :icon="Building2" />
              <SidebarItem to="/master/user" label="Usuários" :icon="Users" />
              <SidebarItem
                to="/master/financial_category"
                label="Categorias Financeiras"
                :icon="Tags"
              />
              <SidebarItem
                to="/master/sales_payment_method"
                label="Metodos de Pagamento"
                :icon="Banknote"
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
import AppNavbar from '@/components/layout/AppNavbar.vue'
import SidebarItem from '@/components/layout/components/SidebarItem.vue'

import { Home, Building2, Users, Truck, Tags, Banknote } from 'lucide-vue-next'

import { useSidebar } from '@/composables/useSidebar'
const { isSidebarOpen, toggleSidebar } = useSidebar()
</script>
