<script setup lang="ts">
import { AppUploadXMLDocument } from '@/components/common/XmlUpload'

const onUploaded = () => {
  console.log('feito')
}
const onError = () => {
  console.log('feito')
}
</script>
<template>
  <h1>Modulo Financeiro</h1>
  <div class="mt-2">
    <AppUploadXMLDocument
      action="/api/financeiro/uploadXml"
      :maxSizeMb="5"
      @uploaded="onUploaded"
      @error="onError"
    />
  </div>
</template>
