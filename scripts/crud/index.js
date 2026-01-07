#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Handlebars from 'handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rawPath = process.argv[2]

if (!rawPath) {
  console.error('❌ Informe o namespace. Ex: crud:make master/users')
  process.exit(1)
}

// normaliza barras (Windows/Linux)
const normalizedPath = rawPath.replace(/\\/g, '/')

// separa segmentos
const segments = normalizedPath.split('/')

// último é o recurso
const resource = segments.pop()

// caminho base (namespace)
const namespacePath = segments.join('/')

// helpers
const toPascalCase = (str) =>
  str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

const moduleName = resource.toLowerCase()
const className = toPascalCase(resource)

// diretório final
const basePath = path.resolve(
  `src/modules/${namespacePath ? namespacePath + '/' : ''}${moduleName}`,
)

if (!name) {
  console.error('❌ Informe o nome do CRUD. Ex: crud:make users')
  process.exit(1)
}

const moduleName = name.toLowerCase()
const className = name.charAt(0).toUpperCase() + name.slice(1)

const basePath = path.resolve(`src/modules/${moduleName}`)

const folders = ['pages', 'components']

folders.forEach((folder) => fs.mkdirSync(path.join(basePath, folder), { recursive: true }))

const templatesPath = path.join(__dirname, 'templates')

const files = [
  { tpl: 'index.vue.hbs', out: 'pages/index.vue' },
  { tpl: 'create.vue.hbs', out: 'pages/create.vue' },
  { tpl: 'update.vue.hbs', out: 'pages/update.vue' },
  { tpl: 'form.vue.hbs', out: `components/${className}Form.vue` },
  { tpl: 'routes.ts.hbs', out: 'routes.ts' },
  { tpl: 'types.ts.hbs', out: 'types.ts' },
]

files.forEach(({ tpl, out }) => {
  const template = fs.readFileSync(path.join(templatesPath, tpl), 'utf8')
  const compiled = Handlebars.compile(template)

  const fullRoute = [...segments, moduleName].join('/')

  const content = compiled({
    moduleName,
    className,
    fullRoute,
  })

  fs.writeFileSync(path.join(basePath, out), content)
})

console.log(`✅ CRUD "${moduleName}" criado com sucesso`)
