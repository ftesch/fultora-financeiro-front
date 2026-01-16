import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import router from '@/router'

import type { User, LoginCredentials, LoginResponse, Licensor } from '@/types/auth'
import { handleError } from '@/utils/helpers'
import type { ApiResponse } from '@/types/common'
import { useModulesStore } from './module'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
  /* ===============================
   * STATE
   * =============================== */
  const user = ref<User | null>(null)
  const licensor = ref<Licensor | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const plans = computed(() => licensor.value?.plans)

  const getModules = computed(() => {
    return user.value?.modules
  })

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

      const { data } = await api.post<ApiResponse<LoginResponse>>('/api/login', credentials)

      user.value = data.data.user
      licensor.value = data.data.licensor
      token.value = data.data.token ?? null

      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token)
      }

      const { setModules } = useModulesStore()
      setModules(user.value.modules)

      router.push('/app')
    } catch (error: any) {
      handleError(error?.response)
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
      const { data } = await api.get<ApiResponse<LoginResponse>>('/api/user')
      user.value = data.data.user
      licensor.value = data.data.licensor

      const { setModules } = useModulesStore()
      setModules(user.value.modules)
    } catch {
      user.value = null
      licensor.value = null
      token.value = null
    } finally {
      loading.value = false
    }
  }

  function setLicensor(payload: Licensor) {
    licensor.value = payload
  }

  const initAuth = async () => {
    const savedToken = localStorage.getItem('auth_token')

    if (!savedToken) return

    token.value = savedToken

    try {
      const { data } = await api.get<ApiResponse<LoginResponse>>('/api/user')
      user.value = data.data.user
      licensor.value = data.data.licensor

      const { setModules } = useModulesStore()
      setModules(user.value.modules)
    } catch {
      // token inválido / expirado
      user.value = null
      licensor.value = null
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
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    loading.value = true

    try {
      await getCsrfCookie()

      const { data } = await api.post('/api/reset-password', payload)
      toast(data.message)
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (payload: { email: string }) => {
    loading.value = true

    try {
      await getCsrfCookie()

      const { data } = await api.post('/api/forgot-password', payload)

      toast.success(data.message)
    } catch (error: any) {
      handleError(error?.response)

      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    user,
    licensor,
    token,
    loading,
    isAuthenticated,
    plans,

    // actions
    login,
    logout,
    fetchUser,
    initAuth,
    register,
    getModules,
    setLicensor,
    resetPassword,
    forgotPassword,
  }
})
