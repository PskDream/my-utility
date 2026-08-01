<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import BackHomeLink from '@/components/BackHomeLink.vue'
import TripSummary from '@/components/fukuoka-trip/TripSummary.vue'
import TripDaySchedule from '@/components/fukuoka-trip/TripDaySchedule.vue'
import { tripMeta, tripDays } from '@/data/fukuoka-trip'
</script>

<template>
  <div>
    <BackHomeLink />
    <h1 class="mb-4 text-2xl font-bold">{{ tripMeta.title }}</h1>
    <TripSummary :meta="tripMeta" />
    <Accordion :value="['0']" multiple>
      <AccordionPanel v-for="day in tripDays" :key="day.day" :value="String(day.day - 1)">
        <AccordionHeader>
          <div class="flex flex-col gap-0.5 text-left">
            <span class="font-semibold">Day {{ day.day }} — {{ day.weekday }} {{ day.date }} | {{ day.route }}</span>
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
