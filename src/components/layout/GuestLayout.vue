<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <img
      :src="logo"
      alt="Fultora IA"
      class="pointer-events-none fixed bottom-6 right-6 w-48 opacity-[0.20] grayscale select-none transition-opacity dark:opacity-[0.30] animate-fade-in"
    />

    <!-- Navbar -->
    <header class="flex items-center justify-between border-b border-border px-6 py-4 bg-card h-14">
      <!-- Logo / Nome -->
      <div class="flex items-center gap-2 font-semibold">
        <span class="text-lg">Fultora IA</span>
      </div>

      <!-- Actions -->
      <button
        @click="toggleTheme"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-accent"
        aria-label="Alternar tema"
      >
        <span v-if="isDark">🌙</span>
        <span v-else>🌞</span>
      </button>
    </header>

    <!-- Conteúdo -->
    <main class="flex flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logo from '@/assets/images/FultoraIALogo.svg'

const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  const html = document.documentElement
  isDark.value = dark

  if (dark) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleTheme = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') {
    applyTheme(true)
  } else if (savedTheme === 'light') {
    applyTheme(false)
  } else {
    // fallback: sistema operacional
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }
})
</script>
