<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppNavbar />

    <main class="p-6">
      <route-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/layout/AppNavbar.vue'
</script>
