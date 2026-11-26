<script setup lang="ts">
import { computed, ref } from 'vue'
import { GROUPS, f0, f2, fmtDate, personColor, sum, type SplitData } from '@/utils/splitwise'

const props = defineProps<{ data: SplitData }>()

type Filter = 'all' | 'shared' | 'personal'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'shared', label: 'ส่วนกลาง' },
  { key: 'personal', label: 'ส่วนตัว/ไม่เท่ากัน' },
]

const selected = ref(0)
const filter = ref<Filter>('all')

const totals = computed(() =>
  props.data.people.map((name, i) => ({
    all: sum(props.data.txs.map((t) => t.shares[i]!)),
    shared: sum(props.data.txs.filter((t) => t.equal).map((t) => t.shares[i]!)),
    personal: sum(props.data.txs.filter((t) => !t.equal).map((t) => t.shares[i]!)),
    paid: sum(props.data.txs.filter((t) => t.payer === name).map((t) => t.total)),
  })),
)
const maxAll = computed(() => Math.max(...totals.value.map((p) => p.all)))

const heat = computed(() =>
  props.data.people.map((_, i) =>
    GROUPS.map((_g, g) => sum(props.data.txs.filter((t) => t.group === g).map((t) => t.shares[i]!))),
  ),
)
const usedGroups = computed(() =>
  GROUPS.map((name, g) => ({ name, g })).filter(({ g }) => heat.value.some((row) => row[g]! > 0)),
)
const heatMax = computed(() => Math.max(...heat.value.flat()))

function cellStyle(v: number) {
  if (v <= 0) return {}
  const a = 0.07 + 0.83 * (v / heatMax.value)
  return {
    background: `color-mix(in srgb, var(--p-primary-color) ${Math.round(a * 100)}%, transparent)`,
    color: a > 0.55 ? 'var(--p-primary-contrast-color)' : 'var(--p-text-color)',
  }
}

const rows = computed(() => {
  const i = selected.value
  const all = props.data.txs.filter((t) => t.shares[i]! > 0.004)
  const counts = {
    all: all.length,
    shared: all.filter((t) => t.equal).length,
    personal: all.filter((t) => !t.equal).length,
  }
  const list = all
    .filter((t) => filter.value === 'all' || (filter.value === 'shared') === t.equal)
    .sort((a, b) => (a.date === b.date ? b.shares[i]! - a.shares[i]! : a.date < b.date ? -1 : 1))
  return { list, counts }
})

const card =
  'flex flex-col gap-3 rounded-lg border border-[var(--p-content-border-color)] bg-[var(--p-content-background)] p-4'
const th = 'border-b border-[var(--p-content-border-color)] px-2 py-1.5 font-medium'
const td = 'border-b border-[var(--p-content-border-color)] px-2 py-1.5'
</script>

<template>
  <div class="flex flex-col gap-4">
    <section :class="card">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 class="text-base font-semibold">ยอดจริงของแต่ละคน</h2>
        <small class="text-[var(--p-text-muted-color)]">แถบเทียบกันได้ทุกคน</small>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-[0.85rem] text-[var(--p-text-muted-color)]">
        <span class="flex items-center gap-1.5"><i class="inline-block size-2.5 rounded-sm bg-primary" />ส่วนกลาง (หารเท่ากัน)</span>
        <span class="flex items-center gap-1.5"><i class="inline-block size-2.5 rounded-sm bg-primary/35" />ส่วนตัว / หารไม่เท่ากัน</span>
      </div>
      <div class="flex flex-col">
        <div
          v-for="(name, i) in data.people"
          :key="name"
          class="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-x-3 gap-y-1 py-1.5 sm:grid-cols-[10rem_minmax(0,1fr)_5rem]"
          :title="`${name}\nรวม ฿${f2(totals[i]!.all)}\nส่วนกลาง ฿${f2(totals[i]!.shared)}\nส่วนตัว/ไม่เท่ากัน ฿${f2(totals[i]!.personal)}`"
        >
          <span class="flex min-w-0 items-center gap-2">
            <i class="size-2.5 flex-none rounded-full" :class="personColor(i)" />
            <span class="truncate">{{ name }}</span>
          </span>
          <div class="order-3 col-span-2 h-3 sm:order-none sm:col-span-1">
            <div class="flex h-full gap-0.5" :style="{ width: `${(totals[i]!.all / maxAll) * 100}%` }">
              <div class="h-full bg-primary" :style="{ width: `${(totals[i]!.shared / totals[i]!.all) * 100}%` }" />
              <div class="h-full rounded-r bg-primary/35" :style="{ width: `${(totals[i]!.personal / totals[i]!.all) * 100}%` }" />
            </div>
          </div>
          <span class="text-right font-semibold tabular-nums">฿{{ f0(totals[i]!.all) }}</span>
        </div>
      </div>
    </section>

    <section :class="card">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 class="text-base font-semibold">ใครใช้หมวดไหนเท่าไหร่</h2>
        <small class="text-[var(--p-text-muted-color)]">ยิ่งเข้ม ยิ่งมาก (฿)</small>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[40rem] border-separate border-spacing-0.5 text-[0.9rem] tabular-nums">
          <thead>
            <tr class="text-[0.78rem] text-[var(--p-text-muted-color)]">
              <th class="px-1 py-1 text-left font-medium" />
              <th v-for="g in usedGroups" :key="g.g" class="min-w-[4.4rem] px-1 py-1 text-center align-bottom font-medium">
                {{ g.name }}
              </th>
              <th class="px-2 py-1 text-right font-medium">รวม</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(name, i) in data.people" :key="name">
              <td class="whitespace-nowrap py-1 pr-2">
                <span class="flex items-center gap-2">
                  <i class="size-2.5 rounded-full" :class="personColor(i)" />{{ name }}
                </span>
              </td>
              <td v-for="g in usedGroups" :key="g.g" class="p-0">
                <div
                  class="rounded-md px-1.5 py-1.5 text-center font-medium"
                  :style="cellStyle(heat[i]![g.g]!)"
                  :title="heat[i]![g.g]! > 0 ? `${name} · ${g.name}\n฿${f2(heat[i]![g.g]!)}` : undefined"
                >
                  {{ heat[i]![g.g]! > 0 ? f0(heat[i]![g.g]!) : '–' }}
                </div>
              </td>
              <td class="px-2 text-right font-semibold">{{ f0(totals[i]!.all) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section :class="card">
      <h2 class="text-base font-semibold">รายการของแต่ละคน</h2>
      <div class="flex flex-wrap gap-2" role="group" aria-label="เลือกคน">
        <button
          v-for="(name, i) in data.people"
          :key="name"
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-transparent py-1.5 pr-3.5 pl-2.5 text-inherit"
          :class="
            selected === i
              ? 'border-[var(--p-text-color)] font-semibold'
              : 'border-[var(--p-content-border-color)]'
          "
          :aria-pressed="selected === i"
          @click="selected = i"
        >
          <i class="size-2.5 rounded-full" :class="personColor(i)" />{{ name }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="rounded-lg bg-[var(--p-content-hover-background)] px-3 py-2.5">
          <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">ยอดจริงรวม</div>
          <div class="text-xl font-bold tabular-nums">฿{{ f0(totals[selected]!.all) }}</div>
        </div>
        <div class="rounded-lg bg-[var(--p-content-hover-background)] px-3 py-2.5">
          <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">ส่วนกลาง</div>
          <div class="text-xl font-bold tabular-nums">฿{{ f0(totals[selected]!.shared) }}</div>
        </div>
        <div class="rounded-lg bg-[var(--p-content-hover-background)] px-3 py-2.5">
          <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">ส่วนตัว/ไม่เท่ากัน</div>
          <div class="text-xl font-bold tabular-nums">฿{{ f0(totals[selected]!.personal) }}</div>
        </div>
        <div class="rounded-lg bg-[var(--p-content-hover-background)] px-3 py-2.5">
          <div class="text-[0.8rem] text-[var(--p-text-muted-color)]">จ่ายให้ก่อน</div>
          <div class="text-xl font-bold tabular-nums">฿{{ f0(totals[selected]!.paid) }}</div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="f in FILTERS"
          :key="f.key"
          type="button"
          class="cursor-pointer rounded-full border px-3 py-0.5 text-[0.85rem]"
          :class="
            filter === f.key
              ? 'border-[var(--p-text-color)] bg-[var(--p-text-color)] text-[var(--p-content-background)]'
              : 'border-[var(--p-content-border-color)] bg-transparent text-[var(--p-text-muted-color)]'
          "
          :aria-pressed="filter === f.key"
          @click="filter = f.key"
        >
          {{ f.label }} ({{ rows.counts[f.key] }})
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[34rem] border-collapse text-[0.9rem] tabular-nums">
          <thead>
            <tr class="text-[0.8rem] text-[var(--p-text-muted-color)]">
              <th :class="th" class="text-left">รายการ</th>
              <th :class="th" class="text-left">หมวด</th>
              <th :class="th" class="text-right">วันที่</th>
              <th :class="th" class="text-right">ยอดรวม</th>
              <th :class="th" class="text-right">ส่วนของ {{ data.people[selected] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, k) in rows.list" :key="k">
              <td :class="td">
                {{ t.name }}
                <span
                  class="ml-1 rounded-full px-1.5 py-px text-[0.72rem] whitespace-nowrap"
                  :class="
                    t.equal
                      ? 'bg-[var(--p-highlight-background)] text-[var(--p-highlight-color)]'
                      : 'bg-[var(--p-content-hover-background)] text-[var(--p-text-muted-color)]'
                  "
                  >{{ t.equal ? 'กลาง' : 'ส่วนตัว' }}</span
                >
                <span
                  v-if="t.payer === data.people[selected]"
                  class="ml-1 rounded-full border border-[var(--p-content-border-color)] px-1.5 py-px text-[0.72rem] whitespace-nowrap text-[var(--p-text-muted-color)]"
                  >จ่ายก่อน</span
                >
              </td>
              <td :class="td" class="text-[var(--p-text-muted-color)]">{{ GROUPS[t.group] }}</td>
              <td :class="td" class="text-right text-[var(--p-text-muted-color)]">{{ fmtDate(t.date) }}</td>
              <td :class="td" class="text-right">{{ f2(t.total) }}</td>
              <td :class="td" class="text-right font-bold">{{ f2(t.shares[selected]!) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[0.8rem] text-[var(--p-text-muted-color)]">
        “จ่ายก่อน” คือรายการที่คนนี้ออกเงินไปก่อน (ยอดรวมของรายการนั้น ไม่ใช่ส่วนของตัวเอง)
      </p>
    </section>
  </div>
</template>
