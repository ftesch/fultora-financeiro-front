<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Card, Input, Button } from '@/components/ui'
import AppFormField from '@/components/common/AppFormField.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const { login } = useAuthStore()
const { loading } = storeToRefs(useAuthStore())

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive<{
  email?: string
  password?: string
}>({})

const submit = async () => {
  errors.email = undefined
  errors.password = undefined

  try {
    // Simulação de validação
    if (!form.email) {
      errors.email = 'Informe seu e-mail'
    }

    if (!form.password) {
      errors.password = 'Informe sua senha'
    }

    if (errors.email || errors.password) {
      return
    }

    await login({ email: form.email, password: form.password })
  } finally {
  }
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-4">
    <Card class="w-full max-w-md">
      <!-- Header -->
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p class="text-sm text-muted-foreground">Acesse sua conta para continuar</p>
        </div>
      </template>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="submit">
        <AppFormField label="E-mail" required for="email" :error="errors.email">
          <Input id="email" v-model="form.email" type="email" placeholder="seu@email.com" />
        </AppFormField>

        <AppFormField label="Senha" required for="password" :error="errors.password">
          <Input id="password" v-model="form.password" type="password" placeholder="" />
        </AppFormField>

        <Button type="submit" class="w-full" :loading="loading" :disabled="loading">
          Entrar
        </Button>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="flex items-center justify-between text-sm">
          <a href="/forgot-password" class="text-muted-foreground hover:text-primary transition">
            Esqueci minha senha
          </a>

          <a href="/register" class="font-medium text-primary hover:underline"> Criar conta </a>
        </div>
      </template>
    </Card>
  </div>
</template>
