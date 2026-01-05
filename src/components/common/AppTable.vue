<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { PropType } from 'vue'

export type ColumnAlign = 'left' | 'center' | 'right'
type TableVariant = 'flat' | 'bordered' | 'elevated'

export interface Column<T = any> {
  label: string
  key: keyof T
  align?: ColumnAlign
}

type Density = 'comfortable' | 'compact' | 'dense'

const props = defineProps({
  caption: String,

  columns: {
    type: Array as PropType<Column[]>,
    required: true,
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

  density: {
    type: String as PropType<Density>,
    default: 'comfortable',
  },
  variant: {
    type: String as PropType<TableVariant>,
    default: 'flat',
  },
})

const densityClass = {
  comfortable: 'py-4 px-4',
  compact: 'py-2 px-3',
  dense: 'py-1 px-2 text-sm',
}

const alignClassMap: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const variantClassMap: Record<TableVariant, string> = {
  flat: '',
  bordered: 'border border-border rounded-lg',
  elevated: 'border border-border rounded-lg shadow-sm',
}
</script>

<template>
  <div :class="variantClassMap[variant]">
    <Table>
      <TableCaption v-if="caption">
        {{ caption }}
      </TableCaption>

      <!-- Header -->
      <TableHeader class="bg-muted/40">
        <TableRow>
          <TableHead
            v-for="col in columns"
            :key="col.key as string"
            :class="[densityClass[density], alignClassMap[col.align ?? 'left']]"
          >
            {{ col.label }}
          </TableHead>

          <TableHead v-if="hasActions" class="text-right w-[60px]" :class="densityClass[density]"
            >Ações</TableHead
          >
        </TableRow>
      </TableHeader>
      <!-- Body -->
      <TableBody>
        <!-- Loading -->
        <TableRow v-if="loading">
          <TableCell
            :colspan="columns.length + (hasActions ? 1 : 0)"
            class="text-center py-8 text-muted-foreground"
          >
            Carregando...
          </TableCell>
        </TableRow>

        <!-- Empty -->
        <TableRow v-else-if="!data.length">
          <TableCell
            :colspan="columns.length + (hasActions ? 1 : 0)"
            class="text-center py-8 text-muted-foreground"
          >
            {{ emptyText }}
          </TableCell>
        </TableRow>

        <!-- Rows -->
        <TableRow v-else v-for="(row, rowIndex) in data" :key="rowIndex">
          <TableCell
            v-for="col in columns"
            :key="col.key as string"
            :class="[densityClass[density], alignClassMap[col.align ?? 'left']]"
          >
            <slot :name="`cell:${String(col.key)}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </TableCell>

          <!-- Actions -->
          <TableCell v-if="hasActions" :class="densityClass[density]" class="text-right">
            <slot name="actions" :row="row" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
