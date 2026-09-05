<script setup lang="ts">
import type { TripMeta } from '@/types/trip'
import { CATEGORY_INFO } from '@/utils/tripCategories'

defineProps<{ meta: TripMeta }>()
</script>

<template>
  <div
    class="mb-6 flex flex-col gap-3 rounded-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] p-4"
  >
    <div class="flex items-start gap-2">
      <span class="pi pi-calendar mt-0.5 text-[var(--p-text-muted-color)]" />
      <span>{{ meta.dateRange }}</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="pi pi-map mt-0.5 text-[var(--p-text-muted-color)]" />
      <span>{{ meta.routeSummary }}</span>
    </div>
    <div class="flex flex-wrap gap-3 text-[0.85rem] text-[var(--p-text-muted-color)]">
      <span v-for="stat in meta.stats" :key="stat" class="flex items-center gap-1.5">
        <span class="pi pi-users" />
        {{ stat }}
      </span>
    </div>
    <p class="text-[0.85rem] text-[var(--p-text-muted-color)]">{{ meta.concept }}</p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="item in meta.priorityWeights"
        :key="item.category"
        class="rounded-full bg-[var(--p-content-hover-background)] px-2.5 py-1 text-[0.8rem]"
      >
        {{ CATEGORY_INFO[item.category].emoji }} {{ CATEGORY_INFO[item.category].label }} {{ item.weight }}%
      </span>
    </div>
  </div>
</template>
