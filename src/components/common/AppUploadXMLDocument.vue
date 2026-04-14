<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
  action: string
  maxSizeMb?: number
}>()

const emit = defineEmits<{
  (e: 'uploaded', response: any): void
  (e: 'error', error: any): void
}>()

const file = ref<File | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const maxSize = (props.maxSizeMb ?? 5) * 1024 * 1024

function onFileChange(event: Event) {
  error.value = null

  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const selectedFile = target.files[0]
  if (!selectedFile) return

  if (selectedFile.type !== 'text/xml' && !selectedFile.name.endsWith('.xml')) {
    error.value = 'Apenas arquivos XML são permitidos.'
    return
  }

  if (selectedFile.size > maxSize) {
    error.value = `O arquivo deve ter no máximo ${props.maxSizeMb ?? 5}MB.`
    return
  }

  file.value = selectedFile
}

async function upload() {
  if (!file.value) {
    error.value = 'Selecione um arquivo XML.'
    return
  }

  loading.value = true
  error.value = null

  try {
    const formData = new FormData()
    formData.append('file', file.value)

    const response = await axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    emit('uploaded', response.data)
    file.value = null
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Erro ao enviar o arquivo.'
    emit('error', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-4 rounded-lg border border-dashed border-gray-300 p-4">
    <div>
      <input
        type="file"
        accept=".xml,text/xml"
        class="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-200"
        @change="onFileChange"
      />
    </div>

    <p v-if="file" class="text-sm text-gray-600">
      Arquivo selecionado:
      <span class="font-medium">{{ file.name }}</span>
    </p>

    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>

    <div class="flex justify-end">
      <button
        type="button"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        :disabled="loading"
        @click="upload"
      >
        <span v-if="!loading">Enviar XML</span>
        <span v-else>Enviando...</span>
      </button>
    </div>
  </div>
</template>
