import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import router from '@/router'
import { toast } from 'vue-sonner'
//import { toast } from '@/lib/toast'

export interface User {
  id: number
  name: string
  email: string
}

interface LoginCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  /* ===============================
   * STATE
   * =============================== */
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)


  /* ===============================
   * HELPERS
   * =============================== */
  const showErrorToast = (title: string, description?: string) => {
    toast.error(title, {
      description,
    })
  }

  /* ===============================
   * ACTIONS
   * =============================== */

  /**
   * CSRF cookie (Laravel Sanctum)
   */
  const getCsrfCookie = async () => {
    await api.get('/sanctum/csrf-cookie')
  }

  /**
   * Login
   */
  const login = async (credentials: LoginCredentials) => {
    loading.value = true

    try {
      await getCsrfCookie()

      const { data } = await api.post('/api/login', credentials)

      user.value = data.data.user
      token.value = data.data.token ?? null

      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token)
      }
      router.push('/app')
    } catch (error: any) {
      const status = error?.response?.status
      const response = error?.response?.data

      // 422 - Credenciais inválidas / validação
      if (status === 422) {
        const message =
          response?.errors?.email?.[0] ??
          response?.message ??
          'Credenciais inválidas'

        showErrorToast('Falha no login', message)
      }

      // 500 - Erro inesperado
      else if (status >= 500) {
        showErrorToast(
          'Erro interno',
          'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        )
      }

      // fallback
      else {
        showErrorToast(
          'Erro',
          'Não foi possível realizar o login.'
        )
      }

      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    loading.value = true

    try {
      await api.post('/api/logout')
    } catch {
      // ignora erro de API no logout
    } finally {
      user.value = null
      token.value = null

      localStorage.removeItem('auth_token')
     
      loading.value = false
      router.push('/')
    }
  }

  /**
   * Recupera sessão (reload da página)
   */
  const fetchUser = async () => {
    loading.value = true

    try {
      const { data } = await api.get('/api/user')
      user.value = data
    } catch {
      user.value = null
      token.value = null
    } finally {
      loading.value = false
    }
  }

  const initAuth = async () => {
    const savedToken = localStorage.getItem('auth_token')

    if (!savedToken) return

    token.value = savedToken

    try {
      const { data } = await api.get('/api/user')
      user.value = data.data
    } catch {
      // token inválido / expirado
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
    }
  }

  const register = async (payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true

    try {
      await getCsrfCookie()

      const { data } = await api.post('/api/register', payload)

      user.value = data.data.user
      token.value = data.data.token ?? null

      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token)
      }

      router.push('/app')
    } catch (error) {
      const status = error?.response?.status
      const response = error?.response?.data

      // 422 - Credenciais inválidas / validação
      if (status === 422) {
        const message =
          response?.errors?.email?.[0] ??
          response?.message ??
          'Credenciais inválidas'

        showErrorToast('Falha no login', message)
      }

      // 500 - Erro inesperado
      else if (status >= 500) {
        showErrorToast(
          'Erro interno',
          'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        )
      }

      // fallback
      else {
        showErrorToast(
          'Erro',
          'Não foi possível realizar o login.'
        )
      }

      throw error
    } finally {
      loading.value = false
    }
  }



  return {
    // state
    user,
    token,
    loading,
    isAuthenticated,

    // actions
    getCsrfCookie,
    login,
    logout,
    fetchUser,
    initAuth,
    register
  }
})
