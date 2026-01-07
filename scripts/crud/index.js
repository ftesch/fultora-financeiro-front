#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Handlebars from 'handlebars'

/**
 * =========================
 * Setup ESM
 * =========================
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * =========================
 * Argumento CLI
 * =========================
 * Ex:
 *  npm run crud:make users
 *  npm run crud:make master/users
 */
const rawPath = process.argv[2]

if (!rawPath) {
  console.error('❌ Informe o namespace. Ex: crud:make master/users')
  process.exit(1)
}

/**
 * =========================
 * Normalização de path
 * =========================
 */
const normalizedPath = rawPath.replace(/\\/g, '/')
const segments = normalizedPath.split('/').filter(Boolean)

/**
 * =========================
 * Resource / Namespace
 * =========================
 */
const resource = segments.pop()
const namespacePath = segments.join('/')

if (!resource) {
  console.error('❌ Nome do recurso inválido')
  process.exit(1)
}

/**
 * =========================
 * Helpers de nome
 * =========================
 */
const toPascalCase = (str) =>
  str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

const moduleName = resource.toLowerCase()
const className = toPascalCase(resource)

/**
 * =========================
 * Paths
 * =========================
 */
const basePath = path.resolve(
  `src/modules/${namespacePath ? namespacePath + '/' : ''}${moduleName}`,
)

/**
 * Schema esperado em:
 * src/modules/<namespace>/<resource>/types.ts
 */
const schemaPath = path.resolve(`src/modules/${namespacePath}/${resource}/types.ts`)

/**
 * =========================
 * Parser simples do schema
 * =========================
 */
function parseInterfaceFields(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo types.ts não encontrado: ${filePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(filePath, 'utf8')

  const interfaceMatch = content.match(/interface\s+\w+\s*{([\s\S]*?)}/)

  if (!interfaceMatch) {
    console.error('❌ Nenhuma interface encontrada em types.ts')
    process.exit(1)
  }

  const body = interfaceMatch[1]

  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('//'))
    .map((line) => {
      const match = line.match(/(\w+)\??:\s*(\w+)/)
      if (!match) return null

      return {
        name: match[1],
        type: match[2],
      }
    })
    .filter(Boolean)
}

/**
 * =========================
 * Leitura dos campos
 * =========================
 */
const fields = parseInterfaceFields(schemaPath)

/**
 * =========================
 * Criação de pastas
 * =========================
 */
const folders = ['pages', 'components']

folders.forEach((folder) => {
  fs.mkdirSync(path.join(basePath, folder), { recursive: true })
})

/**
 * =========================
 * Templates
 * =========================
 */
const templatesPath = path.join(__dirname, 'templates')

const files = [
  { template: 'index.vue.hbs', output: 'pages/index.vue' },
  { template: 'create.vue.hbs', output: 'pages/create.vue' },
  { template: 'update.vue.hbs', output: 'pages/update.vue' },
  {
    template: 'form.vue.hbs',
    output: `components/${className}Form.vue`,
  },
  { template: 'store.ts.hbs', output: 'store.ts' }, // 🆕
  { template: 'routes.ts.hbs', output: 'routes.ts' },
]

/**
 * =========================
 * Helpers Handlebars
 * =========================
 */
Handlebars.registerHelper('eq', (a, b) => a === b)

/**
 * =========================
 * Geração dos arquivos
 * =========================
 */
files.forEach(({ template, output }) => {
  const templatePath = path.join(templatesPath, template)

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template não encontrado: ${template}`)
    process.exit(1)
  }

  const source = fs.readFileSync(templatePath, 'utf8')
  const compile = Handlebars.compile(source)

  const content = compile({
    moduleName,
    className,
    namespace: namespacePath,
    fullRoute: [...segments, moduleName].join('/'),
    fields,
  })

  const outputPath = path.join(basePath, output)

  if (fs.existsSync(outputPath)) {
    console.warn(`⚠️ Arquivo já existe, ignorado: ${output}`)
    return
  }

  fs.writeFileSync(outputPath, content)
})

console.log(`
✅ CRUD criado com sucesso!

📦 Recurso: ${moduleName}
📁 Namespace: ${namespacePath || '(root)'}
📍 Caminho: ${basePath}
🧠 Schema: ${schemaPath}
`)
