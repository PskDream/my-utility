<script setup lang="ts">
import Message from 'primevue/message'
import type { TripDay } from '@/types/trip'

defineProps<{ day: TripDay }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col divide-y divide-[var(--p-content-border-color)]">
      <div
        v-for="(activity, index) in day.activities"
        :key="index"
        class="flex gap-3 py-2"
        :class="
          activity.alert
            ? 'rounded-md bg-[var(--p-orange-50,#fff7ed)] px-2 dark:bg-[var(--p-orange-950,#431407)]'
            : ''
        "
      >
        <div class="w-[92px] flex-shrink-0 text-[0.85rem] text-[var(--p-text-muted-color)]">
          {{ activity.time }}
        </div>
        <div class="flex flex-1 flex-col gap-0.5">
          <div class="flex items-center gap-1.5">
            <span
              v-if="activity.starred"
              class="pi pi-star-fill text-[0.8rem] text-[var(--p-yellow-500,#eab308)]"
            />
            <span :class="activity.starred || activity.alert ? 'font-semibold' : ''">{{
              activity.activity
            }}</span>
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
