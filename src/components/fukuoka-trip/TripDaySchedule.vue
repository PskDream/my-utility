<script setup lang="ts">
import Message from 'primevue/message'
import type { TripDay } from '@/types/trip'
import { CATEGORY_INFO, PRIORITY_INFO } from '@/utils/tripCategories'

defineProps<{ day: TripDay }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <p v-if="day.feel" class="text-[0.9rem] text-[var(--p-text-muted-color)]">{{ day.feel }}</p>
    <div class="flex flex-col divide-y divide-[var(--p-content-border-color)]">
      <div
        v-for="(activity, index) in day.activities"
        :key="index"
        class="flex gap-3 py-2 pl-2"
        :class="[
          activity.alert
            ? 'rounded-md bg-[var(--p-orange-50,#fff7ed)] px-2 dark:bg-[var(--p-orange-950,#431407)]'
            : '',
          activity.priority === 'top' ? 'border-l-4 border-[var(--p-yellow-500,#eab308)]' : '',
          activity.priority === 'optional' ? 'border-l-4 border-dashed border-[var(--p-content-border-color)] opacity-70' : '',
        ]"
      >
        <div class="w-[92px] flex-shrink-0 text-[0.85rem] text-[var(--p-text-muted-color)]">
          {{ activity.time }}
        </div>
        <div class="flex flex-1 flex-col gap-0.5">
          <div class="flex flex-wrap items-center gap-1.5">
            <span :class="activity.priority === 'top' ? 'font-semibold' : ''">{{ activity.activity }}</span>
            <span
              v-for="category in activity.categories"
              :key="category"
              :title="CATEGORY_INFO[category].label"
              class="text-[0.8rem]"
            >
              {{ CATEGORY_INFO[category].emoji }}
            </span>
            <span
              v-if="activity.priority"
              class="rounded-full bg-[var(--p-content-hover-background)] px-2 py-0.5 text-[0.7rem] whitespace-nowrap text-[var(--p-text-muted-color)]"
            >
              {{ PRIORITY_INFO[activity.priority].emoji }} {{ PRIORITY_INFO[activity.priority].label }}
            </span>
          </div>
          <div v-if="activity.note" class="text-[0.85rem] text-[var(--p-text-muted-color)]">
            {{ activity.note }}
          </div>
        </div>
      </div>
    </div>
    <Message v-if="day.callout" severity="warn" :closable="false" class="text-[0.9rem]">
      {{ day.callout }}
    </Message>
  </div>
</template>
