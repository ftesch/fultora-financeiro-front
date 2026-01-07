#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawPath = process.argv[2]

if (!rawPath) {
  console.error('❌ Informe o namespace. Ex: module:make master/user')
  process.exit(1)
}

const normalizedPath = rawPath.replace(/\\/g, '/')
const segments = normalizedPath.split('/').filter(Boolean)

const resource = segments.pop()
const namespacePath = segments.join('/')

const modulePath = path.resolve(`src/modules/${namespacePath}/${resource}`)

fs.mkdirSync(modulePath, { recursive: true })

const typeName = resource.charAt(0).toUpperCase() + resource.slice(1)

const typesPath = path.join(modulePath, 'types.ts')

if (!fs.existsSync(typesPath)) {
  fs.writeFileSync(
    typesPath,
    `export interface ${typeName} {
  id?: number
}
`,
  )
}

console.log(`
✅ Módulo criado com sucesso!

📦 Módulo: ${resource}
📁 Caminho: ${modulePath}
🧠 Edite o arquivo types.ts antes de gerar o CRUD
`)
