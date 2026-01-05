<script setup lang="ts">
import { useCompanyStore } from '@/stores/company'

// UI (via components/index.ts)
import { Dialog, Card, Input, Label, Switch, MasketInput, Button } from '@/components/ui'

// Select parts (caso não estejam no index)
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'
import { storeToRefs } from 'pinia'
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { company, loading } = storeToRefs(useCompanyStore())
const { resetCompany, storeCompany, searchCEP } = useCompanyStore()

function close() {
  emit('update:open', false)
  resetCompany()
}

async function save() {
  await storeCompany()
  close()
}
</script>

<template>
  <Dialog
    :open="open"
    title="Cadastrar Empresa"
    description="Preencha os dados da empresa"
    confirm-text="Salvar"
    cancel-text="Cancelar"
    :loading="loading"
    @confirm="save"
    @cancel="close"
    @update:open="emit('update:open', $event)"
    density="compact"
  >
    <Card density="compact">
      <!-- 🔹 Conteúdo (denso, sem CardContent) -->
      <div class="p-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Documento -->
        <div class="md:col-span-2 space-y-1">
          <Label class="text-sm">CPF / CNPJ</Label>
          <MasketInput v-model="company.id_fiscal" mask="cpf-cnpj" />
        </div>

        <!-- Tipo -->
        <div class="space-y-1">
          <Label class="text-sm">Tipo</Label>
          <Select v-model="company.type_person">
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="F">Física</SelectItem>
              <SelectItem value="J">Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Nome -->
        <div class="md:col-span-3 space-y-1">
          <Label class="text-sm">Nome</Label>
          <Input v-model="company.name" />
        </div>

        <!-- Email -->
        <div class="md:col-span-2 space-y-1">
          <Label class="text-sm">Email</Label>
          <Input v-model="company.email" />
        </div>

        <!-- Telefone -->
        <div class="space-y-1">
          <Label class="text-sm">Telefone</Label>
          <MasketInput mask="phone" v-model="company.phone" />
        </div>

        <!-- Flags -->
        <!-- <div class="flex items-center gap-4 pt-5">
          <div class="flex items-center gap-2">
            <Switch
              :checked="company.active === '1'"
              @update:checked="(v) => (company.active = v ? '1' : '0')"
            />
            <Label class="text-sm">Ativa</Label>
          </div>

          <div class="flex items-center gap-2">
            <Switch
              :checked="company.principal === '1'"
              @update:checked="(v) => (company.principal = v ? '1' : '0')"
            />
            <Label class="text-sm">Principal</Label>
          </div>
        </div> -->

        <div class="space-y-1">
          <Input v-model="company.cep" label="CEP" inputmode="numeric">
            <template #suffix>
              <Button size="icon" variant="ghost" @click="searchCEP">
                <Search class="h-4 w-4" />
              </Button>
            </template>
          </Input>
        </div>

        <!-- Endereço -->
        <div class="md:col-span-2 space-y-1">
          <Label class="text-sm font-medium">Endereço</Label>
          <Input v-model="company.endereco" placeholder="Rua, avenida..." />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Número</Label>
          <Input v-model="company.numero" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Complemento</Label>
          <Input v-model="company.complemento" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Bairro</Label>
          <Input v-model="company.bairro" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Cidade</Label>
          <Input v-model="company.cidade" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Estado</Label>
          <Input v-model="company.estado" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">IBGE</Label>
          <Input v-model="company.id_ibge" />
        </div>
      </div>
    </Card>
  </Dialog>
</template>
