<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import BackHomeLink from '@/components/BackHomeLink.vue'
import SplitwisePersonTab from '@/components/splitwise/SplitwisePersonTab.vue'
import SplitwiseSharedTab from '@/components/splitwise/SplitwiseSharedTab.vue'
import SplitwiseUpload from '@/components/splitwise/SplitwiseUpload.vue'
import { fmtDate, parseSplitwise, type SplitData } from '@/utils/splitwise'

const TABS = [
  { label: 'ส่วนกลาง ต่อคน', value: 'shared' },
  { label: 'รายละเอียดทุกคน', value: 'detail' },
]

const data = ref<SplitData | null>(null)
const fileName = ref('')
const error = ref('')
const tab = ref<'shared' | 'detail'>('shared')

async function onLoad(file: File) {
  error.value = ''
  try {
    data.value = parseSplitwise(await file.text())
    fileName.value = file.name
    tab.value = 'shared'
  } catch (e) {
    data.value = null
    error.value = e instanceof Error ? e.message : 'อ่านไฟล์ไม่สำเร็จ'
  }
}

const summary = computed(() => {
  if (!data.value) return ''
  const dates = data.value.txs.map((t) => t.date).sort()
  return `${fmtDate(dates[0]!)} – ${fmtDate(dates[dates.length - 1]!)} · ${data.value.people.length} คน · ${data.value.txs.length} รายการ`
})
</script>

<template>
  <div class="mx-auto flex max-w-[980px] flex-col gap-4">
    <BackHomeLink />
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">สรุปค่าใช้จ่าย Splitwise</h1>
        <p v-if="data" class="mt-1 text-[0.9rem] text-[var(--p-text-muted-color)]">
          {{ fileName }} · {{ summary }}
        </p>
      </div>
      <Button
        v-if="data"
        label="เปลี่ยนไฟล์"
        icon="pi pi-refresh"
        severity="secondary"
        size="small"
        @click="data = null"
      />
    </div>

    <SplitwiseUpload v-if="!data" @load="onLoad" />
    <p v-if="error" class="text-[var(--p-red-500,#e24c4c)]">{{ error }}</p>

    <template v-if="data">
      <SelectButton v-model="tab" :options="TABS" option-label="label" option-value="value" :allow-empty="false" class="self-start" />
      <SplitwiseSharedTab v-if="tab === 'shared'" :data="data" />
      <SplitwisePersonTab v-else :data="data" />
      <p class="text-[0.8rem] text-[var(--p-text-muted-color)]">
        ตัดรายการ “ชำระเงิน” ออกแล้ว ยอดที่แสดงคือส่วนที่แต่ละคนต้องรับผิดชอบจริงของแต่ละรายการ ส่วนกลางคือรายการที่หารเท่ากันทั้งกลุ่ม
      </p>
    </template>
  </div>
</template>
