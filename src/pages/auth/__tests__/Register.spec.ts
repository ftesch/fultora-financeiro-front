import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Register from '@/pages/auth/Register.vue'

const { registerMock, loadingRef } = vi.hoisted(() => ({
  registerMock: vi.fn(),
  loadingRef: { value: false, __v_isRef: true },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    register: registerMock,
    loading: loadingRef,
  }),
}))

vi.mock('pinia', () => ({
  storeToRefs: (store: { loading: { value: boolean } }) => ({
    loading: store.loading,
  }),
}))

describe('Register.vue', () => {
  beforeEach(() => {
    registerMock.mockReset()
    loadingRef.value = false
  })

  it('exibe erros de validação quando submit vazio', async () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Informe seu nome')
    expect(wrapper.text()).toContain('Informe seu e-mail')
    expect(wrapper.text()).toContain('Informe sua senha')
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('exibe erro quando confirmação de senha não confere', async () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })
    const inputs = wrapper.findAll('input')

    await inputs[0]?.setValue('Usuário Teste')
    await inputs[1]?.setValue('user@example.com')
    await inputs[2]?.setValue('123456')
    await inputs[3]?.setValue('654321')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('As senhas não conferem')
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('chama register com payload válido', async () => {
    const wrapper = mount(Register, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })
    const inputs = wrapper.findAll('input')

    await inputs[0]?.setValue('Usuário Teste')
    await inputs[1]?.setValue('user@example.com')
    await inputs[2]?.setValue('123456')
    await inputs[3]?.setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(registerMock).toHaveBeenCalledTimes(1)
    expect(registerMock).toHaveBeenCalledWith({
      name: 'Usuário Teste',
      email: 'user@example.com',
      password: '123456',
      password_confirmation: '123456',
    })
  })
})
