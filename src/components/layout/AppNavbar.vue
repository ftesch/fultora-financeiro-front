<template>
  <header class="border-b bg-card">
    <div class="flex h-14 items-center justify-between px-6">
      <!-- Esquerda: Nome do módulo -->
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-semibold">
          {{ currentModule }}
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
            <DropdownMenuItem> Marketplace </DropdownMenuItem>
            <DropdownMenuItem> Relatórios </DropdownMenuItem>
            <DropdownMenuItem> Automação </DropdownMenuItem>
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
import { Sun, Moon } from 'lucide-vue-next'
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

const { user } = storeToRefs(useAuthStore())

import { useTheme } from '@/composables/useTheme'
import { storeToRefs } from 'pinia'

const { theme, toggleTheme } = useTheme()

const currentModule = 'Marketplace'
</script>
