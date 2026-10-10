<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import BackHomeLink from '@/components/BackHomeLink.vue'
import TripSummary from '@/components/fukuoka-trip/TripSummary.vue'
import TripHighlights from '@/components/fukuoka-trip/TripHighlights.vue'
import TripDaySchedule from '@/components/fukuoka-trip/TripDaySchedule.vue'
import TripMap from '@/components/fukuoka-trip/TripMap.vue'
import { tripMeta, tripHighlights, tripDays } from '@/data/fukuoka-trip'

const openDays = ref(['0'])
const selectedDay = ref('all')

const visibleDays = computed(() =>
  selectedDay.value === 'all' ? tripDays : tripDays.filter((day) => String(day.day) === selectedDay.value),
)

// เลือกวันจากแผนที่ → กางรายละเอียดวันนั้นทันที
watch(selectedDay, (value) => {
  if (value !== 'all') openDays.value = [String(Number(value) - 1)]
})
</script>

<template>
  <div>
    <BackHomeLink />
    <h1 class="mb-4 text-2xl font-bold">{{ tripMeta.title }}</h1>
    <TripSummary :meta="tripMeta" />
    <TripHighlights :highlights="tripHighlights" />
    <TripMap v-model="selectedDay" :days="tripDays" />
    <Accordion v-model:value="openDays" multiple>
      <AccordionPanel v-for="day in visibleDays" :key="day.day" :value="String(day.day - 1)">
        <AccordionHeader>
          <div class="flex flex-col gap-0.5 text-left">
            <span class="font-semibold">Day {{ day.day }} — {{ day.weekday }} {{ day.date }} | {{ day.route }}</span>
            <span class="text-[0.8rem] font-normal text-[var(--p-text-muted-color)]">{{ day.theme }}</span>
            <span v-if="day.driveInfo" class="text-[0.8rem] font-normal text-[var(--p-text-muted-color)]">{{
              day.driveInfo
            }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <TripDaySchedule :day="day" />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
