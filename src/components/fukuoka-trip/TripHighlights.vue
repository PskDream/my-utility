<script setup lang="ts">
import Panel from 'primevue/panel'
import type { TripHighlights } from '@/types/trip'
import { PRIORITY_INFO } from '@/utils/tripCategories'

defineProps<{ highlights: TripHighlights }>()
</script>

<template>
  <Panel header="ถ้าเวลาไม่พอ / ฝนตก / เหนื่อย — รักษาอะไรไว้ก่อน" toggleable collapsed class="mb-6">
    <div class="flex flex-col gap-4">
      <div>
        <div class="mb-1.5 text-[0.85rem] font-semibold">
          {{ PRIORITY_INFO.top.emoji }} {{ PRIORITY_INFO.top.label }}
        </div>
        <ul class="flex list-disc flex-col gap-0.5 pl-5 text-[0.9rem]">
          <li v-for="item in highlights.top" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div>
        <div class="mb-1.5 text-[0.85rem] font-semibold text-[var(--p-text-muted-color)]">
          {{ PRIORITY_INFO.secondary.emoji }} {{ PRIORITY_INFO.secondary.label }}
        </div>
        <ul class="flex list-disc flex-col gap-0.5 pl-5 text-[0.9rem] text-[var(--p-text-muted-color)]">
          <li v-for="item in highlights.secondary" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div>
        <div class="mb-1.5 text-[0.85rem] font-semibold text-[var(--p-text-muted-color)]">
          {{ PRIORITY_INFO.optional.emoji }} {{ PRIORITY_INFO.optional.label }}
        </div>
        <ul class="flex list-disc flex-col gap-0.5 pl-5 text-[0.9rem] text-[var(--p-text-muted-color)]">
          <li v-for="item in highlights.optional" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </Panel>
</template>
