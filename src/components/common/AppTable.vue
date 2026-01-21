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

import { ref, computed, type PropType, watch } from 'vue'
import AppInput from './AppInput.vue'

export type ColumnAlign = 'left' | 'center' | 'right'
type TableVariant = 'flat' | 'bordered' | 'elevated'

export interface Column<T = any> {
  label: string
  key: keyof T
  align?: ColumnAlign
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string | null
  direction: SortDirection
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

  searchable: {
    type: Boolean,
    default: false,
  },

  selectable: {
    type: Boolean,
    default: false,
  },

  multiple: {
    type: Boolean,
    default: true,
  },

  sortable: {
    type: Boolean,
    default: true,
  },

  searchPlaceholder: {
    type: String,
    default: 'Pesquisar...',
  },

  autoFetchOnEmpty: {
    type: Boolean,
    default: false,
  },
})

const search = ref('')
const sort = ref<SortState>({
  key: null,
  direction: null,
})

const emptyTriggered = ref(false)

const selectedRows = ref<any[]>([])

const emit = defineEmits<{
  (e: 'empty'): void
  (e: 'update:selected', value: any[]): void
  (e: 'update:sort', value: SortState): void
}>()

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

watch(
  () => [props.data, props.loading],
  ([data, loading]) => {
    if (
      props.autoFetchOnEmpty &&
      !loading &&
      Array.isArray(data) &&
      data.length === 0 &&
      !emptyTriggered.value
    ) {
      emptyTriggered.value = true
      emit('empty')
    }

    // Reset quando voltar a ter dados
    if (Array.isArray(data) && data.length > 0) {
      emptyTriggered.value = false
    }
  },
  { immediate: true },
)

const filteredData = computed(() => {
  if (!props.searchable || !search.value) return props.data

  const term = search.value.toLowerCase()

  return props.data.filter((row) =>
    props.columns.some((col) =>
      String(row[col.key] ?? '')
        .toLowerCase()
        .includes(term),
    ),
  )
})

const toggleSort = (key: string) => {
  if (sort.value.key !== key) {
    sort.value = { key, direction: 'asc' }
  } else if (sort.value.direction === 'asc') {
    sort.value.direction = 'desc'
  } else {
    sort.value = { key: null, direction: null }
  }

  emit('update:sort', sort.value)
}

const toggleRow = (row: any) => {
  if (!props.selectable) return

  const index = selectedRows.value.indexOf(row)

  if (index >= 0) {
    selectedRows.value.splice(index, 1)
  } else {
    if (!props.multiple) selectedRows.value = []
    selectedRows.value.push(row)
  }

  emit('update:selected', selectedRows.value)
}

const sortedData = computed(() => {
  if (!props.sortable || !sort.value.key || !sort.value.direction) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const key = sort.value.key!
    const dir = sort.value.direction === 'asc' ? 1 : -1

    if (a[key] > b[key]) return dir
    if (a[key] < b[key]) return -dir
    return 0
  })
})
</script>

<template>
  <div :class="variantClassMap[variant]">
    <div v-if="searchable" class="p-2">
      <AppInput v-model="search" :placeholder="searchPlaceholder" />
    </div>

    <Table>
      <TableCaption v-if="caption">
        {{ caption }}
      </TableCaption>

      <!-- Header -->
      <TableHeader class="bg-muted/40">
        <TableRow>
          <TableHead v-if="selectable" class="w-10 text-center">
            <input type="checkbox" />
          </TableHead>
          <TableHead
            v-for="col in columns"
            :key="col.key as string"
            @click="sortable && toggleSort(col.key as string)"
            class="cursor-pointer select-none"
          >
            <div class="flex items-center gap-2">
              {{ col.label }}

              <span v-if="sort.key === col.key">
                {{ sort.direction === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
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
        <TableRow
          v-for="(row, i) in sortedData"
          :key="i"
          @click="toggleRow(row)"
          :class="[selectable && 'cursor-pointer', selectedRows.includes(row) && 'bg-muted/40']"
        >
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
