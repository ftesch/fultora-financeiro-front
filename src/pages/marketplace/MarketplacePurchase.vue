<template>
  <div class="mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4" v-show="hasPrincipalCompany">{{ company.name }}</h1>
    <h1 class="text-xl font-bold mb-4">{{ purchaseProduct?.name }}</h1>
    <div class="flex justify-between">
      <span>
        Você está prestes a comprar o módulo: <strong>{{ purchaseProduct?.name }}</strong>
      </span>
      <Button variant="secondary" @click="router.push({ name: 'marketplace' })">Voltar</Button>
    </div>

    <Table
      class="mt-2"
      :columns="[
        { key: 'plan_id', label: 'Plano' },
        { key: 'price', label: 'Preço', align: 'right' },
        { key: 'users_limit', label: 'Limite de Usuários', align: 'right' },
        { key: 'companies_limit', label: 'Limite de Empresas', align: 'right' },
      ]"
      :data="purchaseProduct?.plans"
      has-actions
      density="compact"
      variant="elevated"
    >
      <template #cell:users_limit="{ row }">
        {{ row.users_limit == 0 ? 'Ilimitado' : row.users_limit }}
      </template>
      <template #cell:companies_limit="{ row }">
        {{ row.companies_limit == 0 ? 'Ilimitado' : row.companies_limit }}
      </template>
      <template #actions="{ row }">
        <Button variant="secondary" @click="handlePurchaseProduct(row)"> Comprar </Button>
      </template>
    </Table>

    <CompanyForm v-model:open="showCompanyForm" />

    <div v-show="showByForm" class="mt-2">
      <Card density="compact">
        <template #header>
          <span
            >Plano Selecionado <strong>{{ purchasePlan?.plan_id }}</strong></span
          >
        </template>
        <div class="p-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <span
              >Máximo de Empresas:
              <strong>{{
                purchasePlan?.companies_limit == 0 ? 'Ilimitado' : purchasePlan?.companies_limit
              }}</strong></span
            >
          </div>
          <div>
            <span
              >Máximo de usuários:
              <strong>{{
                purchasePlan?.users_limit == 0 ? 'Ilimitado' : purchasePlan?.users_limit
              }}</strong></span
            >
          </div>
          <div>
            <span
              >Preço: <strong>{{ purchasePlan?.price }}</strong></span
            >
          </div>
          <div class="md:col-span-1 space-y-2">
            <Label class="text-sm">Quantidade</Label>
            <Input v-model="quantity" type="number" />
          </div>
          <div class="md:col-span-1 mt-6">
            <Button variant="secondary" @click="buyPlan">Confirmar Compra</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, Input, Table } from '@/components/ui'
import { useRoute } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplace'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'
import CompanyForm from '@/components/company/CompanyForm.vue'
import { useCompanyStore } from '@/stores/company'
import { toast } from 'vue-sonner'

const { purchaseProduct, purchasePlan } = storeToRefs(useMarketplaceStore())
const { setPurchasePlan, buyPlan } = useMarketplaceStore()
const { hasPrincipalCompany, company } = storeToRefs(useCompanyStore())

const route = useRoute()
const productId = route.params.id as string

onMounted(() => {
  if (purchaseProduct.value == null || purchaseProduct.value.id !== productId) {
    router.push({ name: 'marketplace' })
  }
})

const showCompanyForm = ref(false)
const showByForm = ref(false)

const quantity = computed<number>({
  get() {
    return purchasePlan.value?.quantity ?? 0
  },
  set(value) {
    if (!purchasePlan.value) return
    purchasePlan.value.quantity = value
  },
})

const handlePurchaseProduct = (plan: any) => {
  if (!hasPrincipalCompany.value) {
    toast('Antes de realizar a compra faça o cadastro da empresa principal')
    showCompanyForm.value = true
  } else {
    toast('Defina uma quantidade e confirme')
    showByForm.value = true
    setPurchasePlan(plan)
  }
}
</script>
