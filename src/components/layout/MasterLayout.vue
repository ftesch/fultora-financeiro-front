<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navbar -->
    <header class="w-full">
      <AppNavbar @toggle-sidebar="toggleSidebar" />
    </header>

    <div class="relative h-[calc(100vh-var(--navbar-height,4rem))]">
      <!-- Overlay (mobile) -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="sidebarOpen = false"
      />

      <!-- Grid -->
      <div class="h-full lg:grid lg:grid-cols-[16rem_1fr]">
        <!-- Sidebar -->
        <aside
          class="fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 lg:static lg:translate-x-0 m-2 rounded-xl bg-sidebar text-sidebar-foreground shadow-sm p-2"
          :class="{
            '-translate-x-full lg:translate-x-0': !sidebarOpen,
            'translate-x-0': sidebarOpen,
          }"
        >
          <div class="px-3 py-2 text-lg font-semibold">Cadastros Master</div>

          <nav class="mt-2">
            <SidebarItem to="/" label="Home" :icon="Home" />
            <SidebarItem to="/master/empresas" label="Empresas" :icon="Building2" />
            <SidebarItem to="/master/user" label="Usuários" :icon="Users" />
            <SidebarItem to="/master/fornecedores" label="Fornecedores" :icon="Truck" />
            <SidebarItem
              to="/master/categorias-financeiras"
              label="Categorias Financeiras"
              :icon="Tags"
            />
          </nav>
        </aside>

        <!-- Conteúdo -->
        <main class="m-2 mt-2 overflow-auto lg:ml-4">
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
