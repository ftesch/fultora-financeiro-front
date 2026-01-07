<template>
  <header class="border-b bg-card">
    <div class="flex h-14 items-center justify-between px-6">
      <!-- Esquerda: Nome do módulo -->
      <div class="flex items-center gap-2">
        <!-- Botão hamburguer -->
        <button
          class="lg:hidden inline-flex items-center justify-center p-2"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="h-5 w-5" />
        </button>

        <!-- Nome da empresa -->
        <h1 class="text-lg font-semibold leading-none">
          {{ company?.name }}
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
                {{ user.name }}
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
import { Sun, Moon, Menu, Home } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
const { logout } = useAuthStore()

const { user, company } = storeToRefs(useAuthStore())

import { useTheme } from '@/composables/useTheme'
import { storeToRefs } from 'pinia'
import { useModulesStore } from '@/stores/module'
import type { Module } from '@/types/auth'
import router from '@/router'

const { theme, toggleTheme } = useTheme()

const { modules } = storeToRefs(useModulesStore())

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const go = (module: Module) => {
  router.push(module.route)
}
const goToHome = () => {
  router.push('/app')
}
</script>
