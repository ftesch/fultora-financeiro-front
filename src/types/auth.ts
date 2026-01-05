export interface Modules {
  name: string
  description: string
  role: string
}

export interface User {
  name: string
  email: string
  modules: Modules[]
}

export interface LoginCredentials {
  email: string
  password: string
}
