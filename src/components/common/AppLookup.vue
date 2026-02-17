<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui'
import AppInput from '@/components/common/AppInput.vue'
import AppDialog from '@/components/common/AppDialog.vue'
import { CheckCircle, Search } from 'lucide-vue-next'

type Column = {
  key: string
  label: string
}

const props = defineProps<{
  modelValue: string | number | null
  object?: any | null
  label?: string
  horizontal?: boolean
  placeholder?: string
  disabled?: boolean

  fetch: () => Promise<any[]>
  columns: Column[]

  getId?: (item: any) => string | number
  getLabel?: (item: any) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'update:object', value: any | null): void
}>()

const open = ref(false)
const loading = ref(false)
const items = ref<any[]>([])
const selectedObject = ref<any | null>(props.object ?? null)

watch(
  () => props.object,
  (value) => {
    selectedObject.value = value ?? null
  },
  { immediate: true },
)

const idResolver = props.getId ?? ((item: any) => item.id)
const labelResolver = computed<(item: any) => string>(() => {
  return props.getLabel ?? ((item: any) => item?.name ?? '')
})

const displayValue = computed(() => {
  if (!selectedObject.value) return ''
  return labelResolver.value(selectedObject.value)
})

async function openDialog() {
  open.value = true
  loading.value = true

  try {
    const { data } = await props.fetch()

    items.value = data.data
  } finally {
    loading.value = false
  }
}

function selectItem(item: any) {
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
    <div v-if="loading" class="text-sm text-muted-foreground">Carregando...</div>

    <table v-else class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th v-for="col in columns" :key="col.key" class="px-2 py-2 text-left font-medium">
            {{ col.label }}
          </th>
          <th class="w-[80px]"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="idResolver(item)" class="border-b hover:bg-secondary/40">
          <td v-for="col in columns" :key="col.key" class="px-1 py-1">
            {{ item[col.key] }}
          </td>

          <td class="px-1 py-1 text-right">
            <Button size="sm" @click="selectItem(item)" :icon="CheckCircle" />
          </td>
        </tr>
      </tbody>
    </table>
  </AppDialog>
</template>
