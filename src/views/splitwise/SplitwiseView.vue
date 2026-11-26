<script setup lang="ts">
import { ref } from 'vue'
import SelectButton from 'primevue/selectbutton'
import BackHomeLink from '@/components/BackHomeLink.vue'
import SplitwisePersonTab from '@/components/splitwise/SplitwisePersonTab.vue'
import SplitwiseSharedTab from '@/components/splitwise/SplitwiseSharedTab.vue'
import csv from '@/data/splitwise-nov26.csv?raw'
import { fmtDate, parseSplitwise } from '@/utils/splitwise'

const TABS = [
  { label: 'ส่วนกลาง ต่อคน', value: 'shared' },
  { label: 'รายละเอียดทุกคน', value: 'detail' },
]

const data = parseSplitwise(csv)
const dates = data.txs.map((t) => t.date).sort()
const summary = `${fmtDate(dates[0]!)} – ${fmtDate(dates[dates.length - 1]!)} · ${data.people.length} คน · ${data.txs.length} รายการ`

const tab = ref<'shared' | 'detail'>('shared')
</script>

<template>
  <div class="mx-auto flex max-w-[980px] flex-col gap-4">
    <BackHomeLink />
    <div>
      <h1 class="text-2xl font-bold">สรุปค่าใช้จ่าย Splitwise</h1>
      <p class="mt-1 text-[0.9rem] text-[var(--p-text-muted-color)]">{{ summary }}</p>
    </div>

    <SelectButton v-model="tab" :options="TABS" option-label="label" option-value="value" :allow-empty="false" class="self-start" />
    <SplitwiseSharedTab v-if="tab === 'shared'" :data="data" />
    <SplitwisePersonTab v-else :data="data" />
    <p class="text-[0.8rem] text-[var(--p-text-muted-color)]">
      ตัดรายการ “ชำระเงิน” ออกแล้ว ยอดที่แสดงคือส่วนที่แต่ละคนต้องรับผิดชอบจริงของแต่ละรายการ ส่วนกลางคือรายการที่หารเท่ากันทั้งกลุ่ม
    </p>
  </div>
</template>
