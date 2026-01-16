<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold">Cadastros Mestres</h1>
      <p class="text-muted-foreground mt-1 max-w-2xl">
        Os cadastros mestres são a base para o funcionamento da aplicação. Complete as etapas abaixo
        para garantir que todos os módulos operem corretamente.
      </p>
    </div>

    <!-- Progresso -->
    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Progresso de configuração</span>
        <span class="text-sm text-muted-foreground">
          {{ completedCount }}/{{ steps.length }} concluídos
        </span>
      </div>

      <div class="h-2 w-full rounded bg-muted overflow-hidden">
        <div class="h-full bg-primary transition-all" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <!-- Checklist -->
    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="step in steps"
        :key="step.key"
        class="flex items-start gap-4 rounded-lg border bg-card p-4"
      >
        <div
          class="mt-1 flex h-8 w-8 items-center justify-center rounded-full"
          :class="
            step.count > 0 ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
          "
        >
          <Check v-if="step.count > 0" class="h-4 w-4" />
          <Circle v-else class="h-4 w-4" />
        </div>

        <div class="flex-1">
          <h3 class="font-medium">{{ step.title }}</h3>
          <p class="text-sm text-muted-foreground mt-1">
            {{ step.description }}
          </p>

          <div class="mt-2 text-sm">
            <span :class="step.count > 0 ? 'text-green-600' : 'text-muted-foreground'">
              {{ step.count }} cadastrados
            </span>
          </div>

          <div class="mt-3">
            <Button size="sm" variant="outline" :to="step.route">
              {{ step.count > 0 ? 'Gerenciar' : 'Cadastrar agora' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conclusão -->
    <div v-if="progress === 100" class="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
      <h3 class="font-medium text-green-700">🎉 Configuração concluída</h3>
      <p class="text-sm text-green-700/80 mt-1">
        Todos os cadastros mestres foram configurados. Sua aplicação está pronta para uso completo.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMasterStore } from './store'
import { Check, Circle } from 'lucide-vue-next'
import { Button } from '@/components/ui'

const { steps, progress, completedCount } = storeToRefs(useMasterStore())
const { fetchData } = useMasterStore()
</script>
