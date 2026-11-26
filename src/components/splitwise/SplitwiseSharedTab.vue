<script setup lang="ts">
import { computed } from 'vue'
import { GROUPS, f0, f2, fmtDate, sum, type SplitData } from '@/utils/splitwise'

const props = defineProps<{ data: SplitData }>()

const n = computed(() => props.data.people.length)
const shared = computed(() => props.data.txs.filter((t) => t.equal))
const grandTotal = computed(() => sum(props.data.txs.map((t) => t.total)))
const total = computed(() => sum(shared.value.map((t) => t.total)))
const perHead = computed(() => total.value / n.value)

const groups = computed(() =>
  GROUPS.map((name, i) => {
    const list = shared.value.filter((t) => t.group === i)
    return { name, count: list.length, amount: sum(list.map((t) => t.total)) / n.value }
  })
    .filter((g) => g.count)
    .sort((a, b) => b.amount - a.amount),
)
const groupMax = computed(() => groups.value[0]?.amount ?? 1)

const items = computed(() =>
  shared.value.map((t) => ({ ...t, per: t.total / n.value })).sort((a, b) => b.per - a.per),
)
const itemMax = computed(() => items.value[0]?.per ?? 1)

const card =
  'flex flex-col gap-3 rounded-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] p-4'
const tile =
  'rounded-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] px-4 py-3'
</script>

<template>
  <div v-if="!shared.length" :class="card" class="text-[var(--p-text-muted-color)]">
    ไม่มีรายการที่หารเท่ากันทั้ง {{ n }} คนในไฟล์นี้
  </div>
  <div v-else class="flex flex-col gap-4">
    <div class="grid grid-cols-2 gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
      <div :class="tile" class="col-span-2 md:col-span-1">
        <div class="text-[0.85rem] text-[var(--p-text-muted-color)]">ค่าใช้จ่ายส่วนกลาง ต่อ 1 คน</div>
        <div class="text-4xl font-bold tabular-nums md:text-[2.75rem] md:leading-tight">
          ฿{{ f0(perHead) }}
        </div>
        <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">หารเท่ากันทั้ง {{ n }} คน</div>
      </div>
      <div :class="tile">
        <div class="text-[0.85rem] text-[var(--p-text-muted-color)]">ยอดส่วนกลางรวม</div>
        <div class="text-2xl font-bold tabular-nums">฿{{ f0(total) }}</div>
        <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">
          {{ Math.round((total / grandTotal) * 100) }}% ของยอดทั้งหมด
        </div>
      </div>
      <div :class="tile">
        <div class="text-[0.85rem] text-[var(--p-text-muted-color)]">จำนวนรายการ</div>
        <div class="text-2xl font-bold tabular-nums">{{ shared.length }}</div>
        <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">จาก {{ data.txs.length }} รายการ</div>
      </div>
    </div>

    <section :class="card">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 class="text-base font-semibold">ต่อคน แยกตามหมวด</h2>
        <small class="text-[var(--p-text-muted-color)]">รวม ฿{{ f0(perHead) }}</small>
      </div>
      <div class="flex flex-col">
        <div
          v-for="g in groups"
          :key="g.name"
          class="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-x-3 gap-y-1 py-1.5 sm:grid-cols-[12rem_minmax(0,1fr)_5rem]"
          :title="`${g.name}\n฿${f2(g.amount)} ต่อคน · ${g.count} รายการ`"
        >
          <span class="truncate">{{ g.name }}</span>
          <div class="order-3 col-span-2 h-3 sm:order-none sm:col-span-1">
            <div
              class="h-full min-w-0.5 rounded-r bg-primary"
              :style="{ width: `${(g.amount / groupMax) * 100}%` }"
            />
          </div>
          <span class="text-right font-semibold tabular-nums">
            ฿{{ f0(g.amount) }}
            <small class="block text-[0.72rem] font-normal text-[var(--p-text-muted-color)]">
              {{ Math.round((g.amount / perHead) * 100) }}%
            </small>
          </span>
        </div>
      </div>
    </section>

    <section :class="card">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 class="text-base font-semibold">ทุกรายการส่วนกลาง</h2>
        <small class="text-[var(--p-text-muted-color)]">เรียงตามยอดต่อคน</small>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[34rem] border-collapse text-[0.9rem] tabular-nums">
          <thead>
            <tr class="text-[0.8rem] text-[var(--p-text-muted-color)]">
              <th class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-left font-medium">รายการ</th>
              <th class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-left font-medium">หมวด</th>
              <th class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-right font-medium">วันที่</th>
              <th class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-right font-medium">ยอดรวม</th>
              <th class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-right font-medium">ต่อคน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, i) in items" :key="i">
              <td class="border-b border-[var(--p-content-border-color)] px-2 py-1.5">{{ t.name }}</td>
              <td class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-[var(--p-text-muted-color)]">
                {{ GROUPS[t.group] }}
              </td>
              <td class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-right text-[var(--p-text-muted-color)]">
                {{ fmtDate(t.date) }}
              </td>
              <td class="border-b border-[var(--p-content-border-color)] px-2 py-1.5 text-right">{{ f0(t.total) }}</td>
              <td class="border-b border-[var(--p-content-border-color)] px-2 py-1.5">
                <div class="flex items-center justify-end gap-2">
                  <div class="flex max-w-[7.5rem] min-w-12 flex-1 justify-start">
                    <div
                      class="h-2 min-w-0.5 rounded-r bg-primary"
                      :style="{ width: `${(t.per / itemMax) * 100}%` }"
                    />
                  </div>
                  <b class="w-16 text-right">{{ f0(t.per) }}</b>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[0.8rem] text-[var(--p-text-muted-color)]">
        รายการที่ไม่หารเท่ากัน หรือหารเฉพาะบางคน ดูได้ในแท็บ “รายละเอียดทุกคน”
      </p>
    </section>
  </div>
</template>
