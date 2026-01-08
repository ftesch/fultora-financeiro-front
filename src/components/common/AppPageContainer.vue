<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  loading?: boolean
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <header
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-secondary/40 px-4 py-3 rounded-md"
    >
      <div class="space-y-2">
        <h1 class="text-xl font-semibold">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-sm text-muted-foreground">
          {{ subtitle }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <!-- Content -->
    <section class="relative">
      <!-- overlay de loading opcional -->
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-md"
      >
        <svg
          class="h-6 w-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>

      <slot />
    </section>
  </div>
</template>
