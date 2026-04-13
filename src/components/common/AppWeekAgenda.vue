<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { isAfter, isBefore, isSameDay, parse, parseISO, startOfDay } from 'date-fns'
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
  minColumnWidth: {
    type: [Number, String],
    default: 220,
  },
  classBeforeData: {
    type: String,
    default: '',
  },
  classAfterData: {
    type: String,
    default: '',
  },
  classCurrentDate: {
    type: String,
    default: '',
  },
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${typeof props.minColumnWidth === 'number' ? `${props.minColumnWidth}px` : props.minColumnWidth}, 100%), 1fr))`,
}))

const resolvedColumns = computed(() => props.columns ?? props.column ?? [])

function getRowKey(row: Record<string, any>, index: number) {
  return row[props.rowKey] ?? row.data ?? index
}

function parseRowDate(value: unknown) {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : startOfDay(value)
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim()
    const supportedFormats = [
      'yyyy-MM-dd',
      "yyyy-MM-dd'T'HH:mm:ss",
      "yyyy-MM-dd'T'HH:mm:ss.SSS",
      "yyyy-MM-dd'T'HH:mm:ssXXX",
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      'dd/MM/yyyy',
    ]

    for (const format of supportedFormats) {
      const parsedDate = format.includes("'T'")
        ? parseISO(normalizedValue)
        : parse(normalizedValue, format, new Date())

      if (!Number.isNaN(parsedDate.getTime())) {
        return startOfDay(parsedDate)
      }
    }
  }

  return null
}

function getDateClass(row: Record<string, any>) {
  const rowDate = parseRowDate(row.data)

  if (!rowDate) return ''

  
  const today = startOfDay(new Date())

  if (isBefore(rowDate, today)) return props.classBeforeData
  if (isAfter(rowDate, today)) return props.classAfterData
  if (isSameDay(rowDate, today)) return props.classCurrentDate

  return ''
}
</script>

<template>
  <div class="w-full">
    <div
      class="grid w-full gap-4 auto-rows-fr"
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
        :class="getDateClass(row)"
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
