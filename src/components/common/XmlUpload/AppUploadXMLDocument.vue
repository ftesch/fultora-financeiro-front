<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useXmlUploadStore } from './useXmlUploadStore'
import { Button } from '@/components/ui'
import { Upload } from 'lucide-vue-next'

const props = defineProps<{
  action: string
  maxSizeMb?: number
}>()

const emit = defineEmits<{
  (e: 'uploaded', response: any): void
  (e: 'error', error: any): void
}>()

const store = useXmlUploadStore()
const { loading, error } = storeToRefs(store)

const files = ref<File[]>([])

const maxSize = (props.maxSizeMb ?? 5) * 1024 * 1024

function onFileChange(event: Event) {
  store.reset()

  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const selectedFiles = Array.from(target.files)
  const validFiles: File[] = []

  for (const file of selectedFiles) {
    if (file.type !== 'text/xml' && !file.name.endsWith('.xml')) {
      store.error = `Arquivo inválido: ${file.name}`
      return
    }

    if (file.size > maxSize) {
      store.error = `Arquivo muito grande: ${file.name}`
      return
    }

    validFiles.push(file)
  }

  files.value = validFiles
}

async function upload() {
  if (!files.value.length) {
    store.error = 'Selecione ao menos um arquivo XML.'
    return
  }

  try {
    const response = await store.uploadXmlFiles(props.action, files.value)

    emit('uploaded', response)
    store.reset()
    files.value = []
  } catch (err) {
    emit('error', err)
  }
}
</script>

<template>
  <div class="space-y-4 rounded-lg border border-dashed border-gray-300 p-4">
    <input
      type="file"
      multiple
      accept=".xml,text/xml"
      class="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-200"
      @change="onFileChange"
    />

    <ul v-if="files.length" class="space-y-1 text-sm text-gray-600">
      <li v-for="file in files" :key="file.name" class="flex justify-between">
        <span>{{ file.name }}</span>
        <span class="text-xs"> {{ (file.size / 1024).toFixed(1) }} KB </span>
      </li>
    </ul>

    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <div class="flex justify-end">
      <Button type="button" :disabled="loading" @click="upload" :icon="Upload">
        <span v-if="!loading"> Enviar {{ files.length }} XML(s) </span>
        <span v-else>Enviando...</span>
      </Button>
    </div>
  </div>
</template>
