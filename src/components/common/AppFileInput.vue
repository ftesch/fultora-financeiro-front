<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Label } from '@/components/ui'
import { Upload } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: File | File[] | null
  label?: string
  horizontal?: boolean
  error?: string
  disabled?: boolean
  multiple?: boolean
  accept?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const displayValue = computed(() => {
  if (!props.modelValue) return ''

  if (Array.isArray(props.modelValue)) {
    return props.modelValue.map((f) => f.name).join(', ')
  }

  return props.modelValue.name
})

function openFileDialog() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    emit('update:modelValue', null)
    return
  }

  if (props.multiple) {
    emit('update:modelValue', Array.from(input.files))
  } else {
    emit('update:modelValue', input.files[0])
  }
}
</script>

<template>
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <!-- Label -->
    <Label v-if="label" :class="horizontal ? 'min-w-[140px] text-right' : ''" :right="horizontal">
      {{ label }}
    </Label>

    <!-- Field -->
    <div class="flex-1 space-y-1">
      <div class="relative flex">
        <!-- Fake input -->
        <input
          type="text"
          readonly
          :value="displayValue"
          :disabled="disabled"
          class="w-full rounded-md border border-input h-9 px-3 py-2 text-sm shadow-sm text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          @click="openFileDialog"
        />

        <!-- Button -->
        <Button
          type="button"
          variant="outline"
          class="ml-2"
          :disabled="disabled"
          @click="openFileDialog"
          :icon="Upload"
        >
          Selecionar
        </Button>

        <!-- Real input -->
        <input
          ref="inputRef"
          type="file"
          class="hidden"
          :multiple="multiple"
          :accept="accept"
          @change="onFileChange"
        />
      </div>

      <!-- Error -->
      <p v-if="error" class="text-xs text-destructive">
        {{ error }}
      </p>
    </div>
  </div>
</template>
