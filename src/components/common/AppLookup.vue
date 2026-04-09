<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui'
import AppInput from '@/components/common/AppInput.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { CheckCircle, Search, X } from 'lucide-vue-next'
import type { ApiResponse } from '@/types/common'

type Column = {
  key: string
  label: string
}

type LookupItem = Record<string, unknown>
type LookupFetchResult =
  | LookupItem[]
  | ApiResponse<LookupItem[]>
  | { data: ApiResponse<LookupItem[]> }

const props = defineProps<{
  modelValue: string | number | null
  object?: LookupItem | null
  label?: string
  horizontal?: boolean
  placeholder?: string
  disabled?: boolean

  fetch: (query?: string) => Promise<LookupFetchResult>
  columns: Column[]

  getId?: (item: LookupItem) => string | number
  getLabel?: (item: LookupItem) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'update:object', value: LookupItem | null): void
}>()

const open = ref(false)
const loading = ref(false)
const items = ref<LookupItem[]>([])
const searchQuery = ref('')
const selectedObject = ref<LookupItem | null>(props.object ?? null)

watch(
  () => props.object,
  (value) => {
    selectedObject.value = value ?? null
  },
  { immediate: true },
)

const idResolver = props.getId ?? ((item: LookupItem) => String(item.id ?? ''))
const labelResolver = computed<(item: LookupItem) => string>(() => {
  return props.getLabel ?? ((item: LookupItem) => String(item?.name ?? ''))
})

const displayValue = computed(() => {
  if (!selectedObject.value) return ''
  return labelResolver.value(selectedObject.value)
})

const filteredItems = computed(() => {
  const query = normalizeSearch(searchQuery.value)

  if (!query) return items.value

  return items.value.filter((item) => itemMatchesQuery(item, query))
})

function resolveItems(result: LookupFetchResult): LookupItem[] {
  if (Array.isArray(result)) return result
  if (Array.isArray(result.data)) return result.data

  const nested = result.data?.data
  return Array.isArray(nested) ? nested : []
}

async function openDialog() {
  open.value = true
  searchQuery.value = ''
  await loadItems()
}

async function loadItems(query?: string) {
  loading.value = true

  try {
    const result = await props.fetch(query)
    items.value = resolveItems(result)
  } finally {
    loading.value = false
  }
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function itemMatchesQuery(item: LookupItem, query: string) {
  return props.columns.some((column) => {
    const value = item[column.key]
    return normalizeSearch(String(value ?? '')).includes(query)
  })
}

async function handleSearch() {
  const query = normalizeSearch(searchQuery.value)

  if (!query) {
    await loadItems()
    return
  }

  if (filteredItems.value.length > 0) return

  await loadItems(searchQuery.value.trim())
}

async function clearSearch() {
  if (!searchQuery.value) return

  searchQuery.value = ''
  await loadItems()
}

function selectItem(item: LookupItem) {
  const id = idResolver(item)

  selectedObject.value = item
  emit('update:modelValue', id)
  emit('update:object', item)

  open.value = false
}

function handleClose() {
  emit('update:modelValue', null)
  emit('update:object', null)

  open.value = false
}
</script>

<template>
  <!-- Input + botão -->
  <AppInput
    :label="label"
    :horizontal="horizontal"
    :placeholder="placeholder"
    :model-value="displayValue"
    :disabled="disabled"
  >
    <template #suffix>
      <Button type="button" size="icon" variant="ghost" :disabled="disabled" @click="openDialog">
        <Search class="h-4 w-4" />
      </Button>
    </template>
  </AppInput>

  <!-- Dialog -->
  <AppDialog :open="open" title="Selecionar registro" size="large" @cancel="handleClose">
    <div class="mb-4">
      <AppInput
        v-model="searchQuery"
        placeholder="Pesquisar nos resultados"
        @keydown.enter.prevent="handleSearch"
      >
        <template #suffix>
          <div class="flex items-center gap-1">
            <Button
              v-if="searchQuery"
              type="button"
              size="icon"
              variant="ghost"
              @click="clearSearch"
            >
              <X class="h-4 w-4" />
            </Button>

            <Button type="button" size="icon" variant="ghost" @click="handleSearch">
              <Search class="h-4 w-4" />
            </Button>
          </div>
        </template>
      </AppInput>
    </div>

    <div v-if="loading" class="text-sm text-muted-foreground">Carregando...</div>

    <table v-else-if="filteredItems.length > 0" class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th v-for="col in columns" :key="col.key" class="px-2 py-2 text-left font-medium">
            {{ col.label }}
          </th>
          <th class="w-[80px]"></th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in filteredItems"
          :key="idResolver(item)"
          class="border-b hover:bg-secondary/40"
        >
          <td v-for="col in columns" :key="col.key" class="px-1 py-1">
            {{ item[col.key] }}
          </td>

          <td class="px-1 py-1 text-right">
            <Button
              size="sm"
              @click="selectItem(item)"
              :icon="CheckCircle"
              class="size-7"
              variant="outline"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-sm text-muted-foreground">
      Nenhum registro encontrado para a pesquisa informada.
    </div>
  </AppDialog>
</template>
