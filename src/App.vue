<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from './components/ui';
import { SpeedInsights } from '@vercel/speed-insights/vue';


</script>

<template>
  <router-view />
  <Toaster richColors />
  <SpeedInsights />

</template>

<style scoped></style>
