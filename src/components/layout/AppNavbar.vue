<template>
  <header class="border-b bg-card">
    <div class="flex h-14 items-center justify-between px-6">
      <!-- Esquerda: Nome do módulo -->
      <div class="flex items-center gap-2">
        <!-- Sidebar toggle (opcional) -->
        <button
          v-if="sidebar"
          class="inline-flex items-center justify-center p-2"
          @click="$emit('toggle-sidebar')"
        >
          <PanelLeftClose v-if="sidebar.open" class="h-5 w-5" />
          <PanelLeftOpen v-else class="h-5 w-5" />
        </button>

        <h1 class="text-lg font-semibold leading-none">
          {{ licensor?.name }}
        </h1>
      </div>
      <!-- Direita: ações -->
      <div class="flex items-center gap-3">
        <!-- Menu de módulos -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm"> Módulos </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="goToHome">
              <Home class="h-4 w-4 text-muted-foreground" />
              <span>App Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem v-for="module in modules" @click="go(module)">
              <component :is="module.icon" class="h-4 w-4 text-muted-foreground" />
              {{ module.name }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Toggle tema -->
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </Button>

        <!-- Usuário -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="flex items-center gap-2">
              <span class="text-sm font-medium">
                {{ user?.name }}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem> Configurações pessoais </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="text-red-500" @click="logout"> Sair </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Sun, Moon, Home, PanelLeftOpen, PanelLeftClose } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { useAuthStore } from '@/stores/auth'
import { useModulesStore } from '@/stores/module'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/composables/useTheme'
import router from '@/router'
import type { Module } from '@/types/auth'

defineProps<{
  sidebar?: {
    open: boolean
  }
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { logout } = useAuthStore()
const { user, licensor } = storeToRefs(useAuthStore())
const { modules } = storeToRefs(useModulesStore())
const { theme, toggleTheme } = useTheme()

const go = (module: Module) => {
  router.push(module.route)
}

const goToHome = () => {
  router.push('/app')
}
</script>
