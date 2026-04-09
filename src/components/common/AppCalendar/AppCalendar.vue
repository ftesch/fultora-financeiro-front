<script setup lang="ts">
import type { DateRange, DateValue } from 'reka-ui'
import { computed, ref } from 'vue'
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { parseDate } from '@internationalized/date'
import { Calendar as UICalendar } from '@/components/ui/calendar'
import { RangeCalendar as UIRangeCalendar } from '@/components/ui/range-calendar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui'
import { cn } from '@/lib/utils'
import { CalendarIcon, X } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'

type CalendarMode = 'single' | 'range'
type CalendarRangeValue = {
  start?: string
  end?: string
}

type CalendarModelValue = string | CalendarRangeValue | undefined

const props = withDefaults(
  defineProps<{
    modelValue?: CalendarModelValue
    mode?: CalendarMode
    label?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    horizontal?: boolean
    clearable?: boolean
    locale?: string
    numberOfMonths?: number
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    minValue?: DateValue
    maxValue?: DateValue
  }>(),
  {
    mode: 'single',
    placeholder: 'Selecione uma data',
    clearable: true,
    locale: 'pt-BR',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CalendarModelValue): void
}>()

const inputId = `calendar-${Math.random().toString(36).substring(2, 9)}`
const open = ref(false)

const formatter = computed(
  () =>
    new Intl.DateTimeFormat(props.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
)

const isRange = computed(() => props.mode === 'range')
const hasError = computed(() => !!props.error)
const singleValue = computed<DateValue | undefined>(() => {
  if (isRange.value || !props.modelValue || typeof props.modelValue !== 'string') {
    return undefined
  }

  return parseDate(props.modelValue)
})

const rangeValue = computed<DateRange | undefined>(() => {
  if (!isRange.value || !props.modelValue || typeof props.modelValue === 'string') {
    return undefined
  }

  return {
    start: props.modelValue.start ? parseDate(props.modelValue.start) : undefined,
    end: props.modelValue.end ? parseDate(props.modelValue.end) : undefined,
  }
})

const hasValue = computed(() =>
  isRange.value
    ? !!rangeValue.value?.start || !!rangeValue.value?.end
    : !!singleValue.value,
)

const displayValue = computed(() => {
  if (isRange.value) {
    const value = rangeValue.value

    if (!value?.start && !value?.end) return props.placeholder
    if (value?.start && !value?.end) return formatDate(value.start)
    if (!value?.start && value?.end) return formatDate(value.end)
    if (!value?.start || !value?.end) return props.placeholder

    return `${formatDate(value.start)} - ${formatDate(value.end)}`
  }

  if (!singleValue.value) return props.placeholder

  return formatDate(singleValue.value)
})

const calendarProps = computed(() => ({
  locale: props.locale,
  disabled: props.disabled,
  numberOfMonths: props.numberOfMonths ?? (isRange.value ? 2 : 1),
  weekStartsOn: props.weekStartsOn,
  minValue: props.minValue,
  maxValue: props.maxValue,
}))

function formatDate(value: DateValue) {
  return formatter.value.format(toDate(value))
}

function serializeDate(value?: DateValue) {
  return value?.toString()
}

function updateSingleValue(value: DateValue | undefined) {
  emit('update:modelValue', serializeDate(value))

  if (value) {
    open.value = false
  }
}

function updateRangeValue(value: DateRange | undefined) {
  emit('update:modelValue', {
    start: serializeDate(value?.start),
    end: serializeDate(value?.end),
  })

  if (value?.start && value?.end) {
    open.value = false
  }
}

function clearValue(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  open.value = false
  emit('update:modelValue', undefined)
}
</script>

<template>
  <div :class="['gap-2', horizontal ? 'flex items-center gap-x-4' : 'flex flex-col space-y-1.5']">
    <Label
      v-if="label"
      :for="inputId"
      :class="horizontal ? 'min-w-[140px] text-right' : ''"
      :right="horizontal"
    >
      {{ label }}
    </Label>

    <div class="flex-1">
      <PopoverRoot v-model:open="open">
        <div class="relative">
          <PopoverTrigger as-child>
            <Button
              :id="inputId"
              type="button"
              variant="outline"
              :disabled="disabled"
              :class="
                cn(
                  'w-full justify-between pr-18 text-left font-normal',
                  !hasValue && 'text-muted-foreground',
                  hasError && 'border-destructive focus-visible:ring-destructive',
                )
              "
            >
              <span class="truncate">
                {{ displayValue }}
              </span>
            </Button>
          </PopoverTrigger>

          <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
            <button
              v-if="clearable && hasValue && !disabled"
              type="button"
              class="pointer-events-auto text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Limpar data"
              @click="clearValue"
            >
              <X class="h-4 w-4 shrink-0" />
            </button>

            <CalendarIcon class="h-4 w-4 shrink-0 opacity-70" />
          </div>
        </div>

        <PopoverContent
          align="start"
          :side-offset="6"
          class="z-50 w-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none"
        >
          <UICalendar
            v-if="!isRange"
            :model-value="singleValue"
            :locale="calendarProps.locale"
            :number-of-months="calendarProps.numberOfMonths"
            :week-starts-on="calendarProps.weekStartsOn"
            :min-value="calendarProps.minValue"
            :max-value="calendarProps.maxValue"
            @update:model-value="updateSingleValue"
          />

          <UIRangeCalendar
            v-else
            :model-value="rangeValue"
            :locale="calendarProps.locale"
            :number-of-months="calendarProps.numberOfMonths"
            :week-starts-on="calendarProps.weekStartsOn"
            :min-value="calendarProps.minValue"
            :max-value="calendarProps.maxValue"
            @update:model-value="updateRangeValue"
          />
        </PopoverContent>
      </PopoverRoot>

      <p v-if="hasError" class="mt-1 text-sm text-destructive">
        {{ error }}
      </p>
    </div>
  </div>
</template>
