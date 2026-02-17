import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('renderiza router-view e toaster', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          'router-view': { template: '<div data-test="router-view" />' },
          Toaster: { template: '<div data-test="toaster" />' },
        },
      },
    })

    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="toaster"]').exists()).toBe(true)
  })
})
