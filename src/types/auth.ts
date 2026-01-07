import type { Component } from 'vue'

export interface Module {
  name: string
  description: string
  role: string
  value: string
  route: string
  icon: Component
}

export interface User {
  name: string
  email: string
  modules: Module[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface Module {
  value: string
  label: string
  route: string
}

export interface Plans {
  module: Module
  users_limit: number
  companies_limit: number
}

export interface Company {
  name: string
  id_fiscal: string
  plans: Plans[]
}

export interface LoginResponse {
  user: User
  company: Company
  token: string
}
