<script setup lang="ts">
import type { TripMeta } from '@/types/trip'

defineProps<{ meta: TripMeta }>()
</script>

<template>
  <div
    class="mb-6 flex flex-col gap-2 rounded-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] p-4"
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
  </div>
</template>
