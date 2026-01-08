<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  disabled?: boolean
  to?: RouteLocationRaw
  label?: string
  icon?: Component
}>()

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <!-- 🔗 BOTÃO COM ROTA -->
  <RouterLink v-if="to" :to="to" custom>
    <template #default="{ navigate }">
      <Button
        :variant="variant"
        :size="size"
        :disabled="isDisabled"
        class="relative inline-flex items-center gap-2"
        @click="!isDisabled && navigate()"
      >
        <!-- Loading -->
        <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
          <svg
            class="h-4 w-4 animate-spin"
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
        </span>

        <!-- Conteúdo -->
        <span class="inline-flex items-center gap-2" :class="{ 'opacity-0': loading }">
          <component v-if="icon" :is="icon" class="h-4 w-4" />

          <slot>
            {{ label }}
          </slot>
        </span>
      </Button>
    </template>
  </RouterLink>

  <!-- 🔘 BOTÃO NORMAL -->
  <Button
    v-else
    :variant="variant"
    :size="size"
    :disabled="isDisabled"
    class="relative inline-flex items-center gap-2"
  >
    <!-- Loading -->
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </span>

    <!-- Conteúdo -->
    <span class="inline-flex items-center gap-2" :class="{ 'opacity-0': loading }">
      <component v-if="icon" :is="icon" class="h-4 w-4" />

      <slot>
        {{ label }}
      </slot>
    </span>
  </Button>
</template>
