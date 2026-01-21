<template>
  <div class="min-h-screen bg-background text-foreground">
    <img
      :src="logo"
      alt="Fultora IA"
      class="pointer-events-none fixed bottom-6 right-6 w-48 opacity-[0.20] grayscale select-none transition-opacity dark:opacity-[0.30] animate-fade-in"
    />
    <AppNavbar />

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/layout/AppNavbar.vue'
import logo from '@/assets/images/FultoraIALogo.svg'
</script>
