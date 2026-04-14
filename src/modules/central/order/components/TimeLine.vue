<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '../store'
import { formatDateBR } from '@/utils/helpers'

const { item } = storeToRefs(useOrderStore())

const firstDocumentDate = computed(() => item.value?.documents?.[0]?.document.data_emissao)

const events = computed(() => [
  {
    id: 'invoice-issued',
    title: 'Emissão das notas fiscais',
    description: 'Notas fiscais emitidas para iniciar o fluxo da Ordem de Pagamento.',
    date: firstDocumentDate.value || item.value?.data_emissao,
  },
  {
    id: 'system-entry',
    title: 'Entrada no sistema',
    description: 'Ordem de Pagamento registrada no sistema.',
    date: item.value?.data_entrada,
  },
  {
    id: 'payment',
    title: 'Pagamento',
    description: 'Pagamento efetivado da Ordem de Pagamento.',
    date: item.value?.data_pagamento,
  },
])
</script>
<template>
  <div class="bg-secondary/40 p-4 rounded-xl">
    <div class="space-y-4">
      <h3 class="text-sm font-semibold">Linha do Tempo da Ordem de Pagamento</h3>

      <ol class="space-y-0">
        <li
          v-for="(event, index) in events"
          :key="event.id"
          class="relative flex gap-4 pb-6 last:pb-0"
        >
          <span
            v-if="index !== events.length - 1"
            class="absolute left-[9px] top-6 h-[calc(100%-8px)] w-px bg-border"
          />

          <span
            class="mt-1 h-5 w-5 shrink-0 rounded-full border-2"
            :class="
              event.date ? 'border-emerald-500 bg-emerald-500/20' : 'border-muted-foreground/30'
            "
          />

          <div class="min-w-0 flex-1 rounded-lg border border-border/70 bg-background/80 p-3">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-medium text-foreground">{{ event.title }}</p>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  event.date ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                "
              >
                {{ event.date ? 'Concluído' : 'Pendente' }}
              </span>
            </div>

            <p class="mt-1 text-xs text-muted-foreground">{{ event.description }}</p>
            <p class="mt-2 text-sm font-medium">
              {{ event.date ? formatDateBR(event.date) : 'Data não informada' }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
