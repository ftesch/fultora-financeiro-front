<template>
  <div class="min-h-screen bg-background text-foreground">
    <img
      :src="logo"
      alt="Fultora IA"
      class="pointer-events-none fixed bottom-6 right-6 w-48 opacity-[0.06] grayscale select-none transition-opacity dark:opacity-[0.08] animate-fade-in"
    />
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
            <div class="px-3 py-1 text-lg font-semibold">Central Financeira</div>

            <nav>
              <SidebarItem to="/central/home" label="Home" :icon="Home" />
              <SidebarItem to="/central/order" label="Ordem" :icon="File" />
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
import logo from '@/assets/images/FultoraIALogo.svg'

import { Home, File, Coins, ClipboardCheckIcon, Banknote } from 'lucide-vue-next'

import { useSidebar } from '@/composables/useSidebar'
const { isSidebarOpen, toggleSidebar } = useSidebar()
</script>
