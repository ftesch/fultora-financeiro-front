// src/stores/modules.ts
import type { Module } from '@/types/auth'
import { Modules, MODULE_ROUTES, type ModuleValue } from '@/types/module'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useModulesStore = defineStore('modules', () => {
  const backendModule = ref<Module[]>([])
  const loaded = ref(false)

  function setModules(payload: Module[]) {
    backendModule.value = payload
    loaded.value = true
  }

  function getRouteByModule(module: ModuleValue): string {
    return MODULE_ROUTES[module]
  }

  const modules = computed(() => {
    return Modules.filter((module) =>
      backendModule.value.some((backendModule) => backendModule.value === module.value),
    )
  })

  return {
    modules,
    loaded,
    setModules,
    getRouteByModule,
  }
})
