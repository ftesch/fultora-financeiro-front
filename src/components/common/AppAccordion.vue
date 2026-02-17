<script setup lang="ts">
import { computed } from 'vue'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

import { ChevronDown } from 'lucide-vue-next'

export interface AccordionItemType {
  title: string
  content?: string
  value?: string
  icon?: any
  triggerClass?: string
  showChevron?: boolean
}

const props = withDefaults(
  defineProps<{
    items: AccordionItemType[]
    type?: 'single' | 'multiple'
    collapsible?: boolean
    modelValue?: string | string[]
  }>(),
  {
    type: 'single',
    collapsible: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <Accordion v-model="value" :type="type" :collapsible="collapsible">
    <AccordionItem
      v-for="(item, index) in items"
      :key="item.value ?? index"
      :value="item.value ?? String(index)"
    >
      <AccordionTrigger
        :class="[
          'flex w-full items-center justify-between py-3 text-left rounded-md px-2',
          'transition-colors',
          'data-[state=open]:bg-muted',
          'data-[state=open]:text-primary',
          item.triggerClass,
        ]"
      >
        <div class="flex items-center gap-2">
          <component v-if="item.icon" :is="item.icon" class="h-4 w-4 text-muted-foreground" />
          <span class="font-medium">{{ item.title }}</span>
        </div>

        <ChevronDown
          v-if="item.showChevron !== false"
          class="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180"
        />
      </AccordionTrigger>

      <AccordionContent class="px-2 pb-3">
        <slot :name="`content.${item.value ?? index}`" :item="item">
          {{ item.content }}
        </slot>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
