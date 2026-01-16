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
  email: '',
})

const errors = reactive<{
  email?: string
}>({})

const submit = async () => {
  // limpa erros
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = undefined))

  if (!form.email) {
    errors.email = 'Informe seu e-mail'
  }

  if (Object.values(errors).some(Boolean)) {
    return
  }

  try {
    await auth.forgotPassword({
      email: form.email,
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
          <h1 class="text-2xl font-semibold tracking-tight">Esqueceu a senha?</h1>
          <p class="text-sm text-muted-foreground">Sem problemas, ajudamos você a reseta-la</p>
        </div>
      </template>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="submit">
        <AppFormField label="E-mail" required for="email" :error="errors.email">
          <Input id="email" v-model="form.email" type="email" />
        </AppFormField>

        <Button type="submit" class="w-full" :loading="loading" :disabled="loading">
          Solicitar link para reset de senha
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
