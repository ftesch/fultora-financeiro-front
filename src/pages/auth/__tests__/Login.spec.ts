import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Login from '@/pages/auth/Login.vue'

const { loginMock, loadingRef } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  loadingRef: { value: false, __v_isRef: true },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: loginMock,
    loading: loadingRef,
  }),
}))

vi.mock('pinia', () => ({
  storeToRefs: (store: { loading: { value: boolean } }) => ({
    loading: store.loading,
  }),
}))

describe('Login.vue', () => {
  beforeEach(() => {
    loginMock.mockReset()
    loadingRef.value = false
  })

  it('exibe erros de validação quando submit vazio', async () => {
    const wrapper = mount(Login)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Informe seu e-mail')
    expect(wrapper.text()).toContain('Informe sua senha')
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('chama login com email e senha válidos', async () => {
    const wrapper = mount(Login)
    const inputs = wrapper.findAll('input')

    await inputs[0]?.setValue('user@example.com')
    await inputs[1]?.setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(loginMock).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: '123456',
    })
  })
})
