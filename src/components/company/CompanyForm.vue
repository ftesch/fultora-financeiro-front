<script setup lang="ts">
import { useLicensorStore } from '@/stores/licensor'

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
  (e: 'confirm'): void
}>()

const { licensor, loading } = storeToRefs(useLicensorStore())
const { resetCompany, storeCompany, searchCEP } = useLicensorStore()

function close() {
  emit('update:open', false)
  resetCompany()
}

async function save() {
  await storeCompany()
  emit('confirm')
  emit('update:open', false)
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
    size="medium"
  >
    <Card density="compact">
      <!-- 🔹 Conteúdo (denso, sem CardContent) -->
      <div class="p-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Documento -->
        <div class="md:col-span-2 space-y-1">
          <Label class="text-sm">CPF / CNPJ</Label>
          <MasketInput v-model="licensor.id_fiscal" mask="cpf-cnpj" />
        </div>

        <!-- Tipo -->
        <div class="space-y-1">
          <Label class="text-sm">Tipo</Label>
          <Select v-model="licensor.type_person">
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
          <Input v-model="licensor.name" />
        </div>

        <!-- Email -->
        <div class="md:col-span-2 space-y-1">
          <Label class="text-sm">Email</Label>
          <Input v-model="licensor.email" />
        </div>

        <!-- Telefone -->
        <div class="space-y-1">
          <Label class="text-sm">Telefone</Label>
          <MasketInput mask="phone" v-model="licensor.phone" />
        </div>

        <div class="space-y-1">
          <Input v-model="licensor.cep" label="CEP" inputmode="numeric">
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
          <Input v-model="licensor.endereco" placeholder="Rua, avenida..." />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Número</Label>
          <Input v-model="licensor.numero" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Complemento</Label>
          <Input v-model="licensor.complemento" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Bairro</Label>
          <Input v-model="licensor.bairro" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Cidade</Label>
          <Input v-model="licensor.cidade" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">Estado</Label>
          <Input v-model="licensor.estado" />
        </div>

        <div class="space-y-1">
          <Label class="text-sm">IBGE</Label>
          <Input v-model="licensor.id_ibge" />
        </div>
      </div>
    </Card>
  </Dialog>
</template>
