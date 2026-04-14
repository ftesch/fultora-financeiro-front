<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Card, Input, Button } from '@/components/ui'
import AppFormField from '@/components/common/AppFormField.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()

const auth = useAuthStore()
const { loading } = storeToRefs(auth)

const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive<{
  token?: string
  email?: string
  password?: string
  password_confirmation?: string
}>({})

const submit = async () => {
  // limpa erros
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = undefined))

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
    await auth.resetPassword({
      token: form.token,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
  } catch {
    // erros já tratados no store (toast)
  }
}

onMounted(() => {
  form.token = typeof route.query.token === 'string' ? route.query.token : ''
  form.email = typeof route.query.email === 'string' ? route.query.email : ''
})
</script>

<template>
  <div class="flex flex-1 items-center justify-center px-4">
    <Card class="w-full max-w-md">
      <!-- Header -->
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p class="text-sm text-muted-foreground">
            Crie sua conta para começar a usar a plataforma
          </p>
        </div>
      </template>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="submit">
        <AppFormField label="E-mail" required for="email" :error="errors.email">
          <Input id="email" v-model="form.email" type="email" />
        </AppFormField>

        <AppFormField label="Senha" required for="password" :error="errors.password">
          <Input id="password" type="password" v-model="form.password" placeholder="••••••••" />
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

        <Button type="submit" class="w-full" :loading="loading" :disabled="loading">
          Alterar a senha
        </Button>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="text-sm text-center">
          <RouterLink to="/" class="ml-1 font-medium text-primary hover:underline">
            Fazer Login
          </RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>
