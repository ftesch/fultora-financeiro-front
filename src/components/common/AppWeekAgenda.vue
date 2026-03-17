<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { Column } from './AppTable.vue'

const props = defineProps({
  columns: {
    type: Array as PropType<Column[]>,
    default: undefined,
  },
  column: {
    type: Array as PropType<Column[]>,
    default: undefined,
  },
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasActions: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: 'Nenhum registro encontrado.',
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  weekColumns: {
    type: Number,
    default: 7,
  },
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.weekColumns}, minmax(220px, 1fr))`,
}))

const resolvedColumns = computed(() => props.columns ?? props.column ?? [])

function getRowKey(row: Record<string, any>, index: number) {
  return row[props.rowKey] ?? row.data ?? index
}
</script>

<template>
  <div class="overflow-x-auto">
    <div
      class="grid min-w-max gap-4 auto-rows-fr"
      :style="gridStyle"
    >
      <div
        v-if="loading"
        class="col-span-full flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground"
      >
        Carregando...
      </div>

      <div
        v-else-if="!data.length"
        class="col-span-full flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground"
      >
        {{ emptyText }}
      </div>

      <div
        v-for="(row, index) in data"
        v-else
        :key="getRowKey(row, index)"
        class="flex h-full min-h-44 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm"
      >
        <slot name="header" :row="row" :index="index" />

        <div class="flex flex-1 flex-col gap-3">
          <div
            v-for="column in resolvedColumns"
            :key="String(column.key)"
            class="rounded-xl bg-muted/35 px-3 py-2"
          >
            <slot
              :name="`cell:${String(column.key)}`"
              :row="row"
              :value="row[column.key]"
              :column="column"
              :index="index"
            >
              <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {{ column.label }}
              </p>
              <p class="mt-1 text-sm font-semibold text-foreground">
                {{ row[column.key] ?? '-' }}
              </p>
            </slot>
          </div>
        </div>

        <div
          v-if="hasActions || $slots.actions || $slots.action"
          class="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3"
        >
          <slot name="actions" :row="row" :index="index" />
          <slot name="action" :row="row" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>
