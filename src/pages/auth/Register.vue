<script setup lang="ts">
import { reactive } from 'vue'
import { Card, Input, Button } from '@/components/ui'
import AppFormField from '@/components/common/AppFormField.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { loading } = storeToRefs(auth)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive<{
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
}>({})

const submit = async () => {
  // limpa erros
  Object.keys(errors).forEach(
    key => (errors[key as keyof typeof errors] = undefined)
  )

  // validação simples (frontend)
  if (!form.name) {
    errors.name = 'Informe seu nome'
  }

  if (!form.email) {
    errors.email = 'Informe seu e-mail'
  }

  if (!form.password) {
    errors.password = 'Informe sua senha'
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'As senhas não conferem'
  }

  if (Object.values(errors).some(Boolean)) {
    return
  }

  try {
    await auth.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
  } catch {
    // erros já tratados no store (toast)
  }
}
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-4">
    <Card class="w-full max-w-md">
      <!-- Header -->
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">
            Criar conta
          </h1>
          <p class="text-sm text-muted-foreground">
            Crie sua conta para começar a usar a plataforma
          </p>
        </div>
      </template>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="submit">
        <AppFormField
          label="Nome"
          required
          for="name"
          :error="errors.name"
        >
          <Input
            id="name"
            v-model="form.name"
            placeholder="Seu nome"
          />
        </AppFormField>

        <AppFormField
          label="E-mail"
          required
          for="email"
          :error="errors.email"
        >
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
          />
        </AppFormField>

        <AppFormField
          label="Senha"
          required
          for="password"
          :error="errors.password"
        >
          <Input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
          />
        </AppFormField>

        <AppFormField
          label="Confirmar senha"
          required
          for="password_confirmation"
          :error="errors.password_confirmation"
        >
          <Input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            placeholder="••••••••"
          />
        </AppFormField>

        <Button
          type="submit"
          class="w-full"
          :loading="loading"
          :disabled="loading"
        >
          Criar conta
        </Button>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="text-sm text-center">
          <span class="text-muted-foreground">
            Já possui conta?
          </span>
          <RouterLink
            to="/"
            class="ml-1 font-medium text-primary hover:underline"
          >
            Entrar
          </RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>
