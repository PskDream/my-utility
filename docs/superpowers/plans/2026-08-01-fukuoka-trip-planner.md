# Fukuoka Trip Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "แพลนทริป Fukuoka" tool to my-utility — a read-only, accordion-based day-by-day itinerary viewer for a hardcoded 7-day trip.

**Architecture:** Follows the existing tool pattern (`docs` in `CLAUDE.md`, see PromptPay): register the tool in `src/tools.ts` and `src/router/index.ts`, put hardcoded trip data in a typed data module, and build small presentational components consumed by one view. No state, no persistence, no forms.

**Tech Stack:** Vue 3 `<script setup>` + TypeScript, PrimeVue v4 (`Accordion`/`AccordionPanel`/`AccordionHeader`/`AccordionContent`, `Message`), Tailwind CSS v4 utility classes only.

## Global Constraints

- No `<style>` blocks in `.vue` files — Tailwind utility classes only (project convention).
- UI text is entirely in Thai.
- Icons are PrimeIcons only (`pi pi-*`).
- **No test suite exists in this repo** — do not write `*.test.*`/`*.spec.*` files or look for a test runner. Verification for every task is `npm run type-check` (must exit 0) plus, for the final task, a manual browser walkthrough via the dev server.
- Data is hardcoded (not user-editable), matching the approved spec at `docs/superpowers/specs/2026-08-01-fukuoka-trip-planner-design.md`.

---

### Task 1: Trip types + itinerary data

**Files:**
- Create: `src/types/trip.ts`
- Create: `src/data/fukuoka-trip.ts`

**Interfaces:**
- Produces: `TripActivity { time: string; activity: string; note?: string; starred?: boolean; alert?: boolean }`, `TripDay { day: number; weekday: string; date: string; route: string; driveInfo?: string; activities: TripActivity[]; callout?: string }`, `TripMeta { title: string; dateRange: string; routeSummary: string; stats: string[] }` (all exported from `src/types/trip.ts`)
- Produces: `tripMeta: TripMeta` and `tripDays: TripDay[]` (exported from `src/data/fukuoka-trip.ts`, importing the types above)

- [ ] **Step 1: Create the types file**

`src/types/trip.ts`:

```ts
export interface TripActivity {
  time: string
  activity: string
  note?: string
  starred?: boolean
  alert?: boolean
}

export interface TripDay {
  day: number
  weekday: string
  date: string
  route: string
  driveInfo?: string
  activities: TripActivity[]
  callout?: string
}

export interface TripMeta {
  title: string
  dateRange: string
  routeSummary: string
  stats: string[]
}
```

- [ ] **Step 2: Create the itinerary data file**

`src/data/fukuoka-trip.ts`:

```ts
import type { TripDay, TripMeta } from '@/types/trip'

export const tripMeta: TripMeta = {
  title: 'แพลนทริป Fukuoka',
  dateRange: '19–25 พ.ย. (7 วัน 6 คืน)',
  routeSummary: 'Fukuoka → Yufuin → Beppu → Aso → Kumamoto → Fukuoka (+ Itoshima day trip)',
  stats: ['7 คน', 'รถเช่า 2 คัน'],
}

export const tripDays: TripDay[] = [
  {
    day: 1,
    weekday: 'พฤหัส',
    date: '19 พ.ย.',
    route: 'Fukuoka → Yufuin',
    driveInfo: 'ขับ ~120 กม. / 2 ชม. · Oita Expressway',
    activities: [
      { time: '07:35', activity: 'ถึงสนามบิน Fukuoka (ตึก International)' },
      { time: '07:35–08:20', activity: 'ตม. + รับกระเป๋า', note: '7 คนใช้เวลา เผื่อไว้ 45 นาที' },
      { time: '08:20–09:00', activity: 'รับรถเช่า 2 คัน', note: 'เช็ครอบรถ ตั้ง ETC ตั้ง Google Maps' },
      { time: '09:00–09:30', activity: 'Lawson ซื้ออาหารเช้า + น้ำ', note: 'เข้าห้องน้ำให้เรียบร้อย' },
      { time: '09:30', activity: 'ออกเดินทาง' },
      { time: '10:45–11:00', activity: 'แวะ SA (Yamada / Kusu)', note: 'จุดนัดรวมรถ 2 คัน' },
      { time: '11:45', activity: 'ถึง Yufuin' },
      { time: '12:00', activity: 'ฝากกระเป๋าที่พัก' },
      { time: '12:15–13:30', activity: 'Lunch — Yufu Mabushi Shin', note: 'คิวยาว ถ้าเกิน 30 นาที เปลี่ยนร้าน' },
      { time: '13:30–16:30', activity: 'Yunotsubo Street', note: 'Snoopy / Miffy / Ghibli / ของฝาก' },
      { time: '16:30–17:15', activity: 'Kinrin Lake', note: 'พระอาทิตย์ตก ~17:15' },
      { time: '17:30', activity: 'Check-in Airbnb' },
      { time: '19:00', activity: 'Dinner — Yakiniku / Izakaya', note: 'Bungo Beef' },
      { time: '21:00', activity: 'กลับที่พัก', note: 'นอนเร็ว วันนี้ทุกคนบินข้ามคืนมา' },
    ],
  },
  {
    day: 2,
    weekday: 'ศุกร์',
    date: '20 พ.ย.',
    route: 'Yufuin → Beppu',
    driveInfo: 'ขับ ~25 กม. / 45 นาที · วันสบายที่สุด',
    activities: [
      { time: '07:30', activity: 'ตื่น' },
      { time: '08:00', activity: 'Breakfast' },
      { time: '09:00', activity: 'Check-out' },
      { time: '09:10–10:00', activity: 'คาเฟ่ Yufuin' },
      { time: '10:00', activity: 'ออกเดินทาง', note: 'ทาง Yamanami Highway วิวสวย' },
      { time: '10:45', activity: 'ถึง Beppu' },
      { time: '11:00–11:50', activity: 'Umi Jigoku', note: 'บ่อสวยสุด ใช้เวลานานหน่อยได้', starred: true },
      { time: '12:00–12:50', activity: 'Kamado Jigoku', note: 'มีไข่ต้มบ่อน้ำร้อน / พุดดิ้ง', starred: true },
      { time: '13:00–14:00', activity: 'Lunch', note: 'Toriten' },
      {
        time: '14:00–14:45',
        activity: 'Oniishibozu Jigoku',
        note: 'เดินจาก Umi ได้ (3 บ่อนี้อยู่โซนเดียวกัน)',
        starred: true,
      },
      { time: '15:00–15:45', activity: 'Chinoike Jigoku', note: 'อยู่คนละโซน ขับ ~15 นาที', starred: true },
      { time: '16:00', activity: 'Check-in Airbnb', note: 'ทุกบ่อปิด 17:00' },
      { time: '17:30', activity: 'ไป Hyotan Onsen' },
      { time: '17:45–20:00', activity: 'แช่ออนเซ็น', note: 'Outdoor / Waterfall / Steam' },
      { time: '20:15', activity: 'Dinner', note: 'Seafood' },
      { time: '22:00', activity: 'นอน', note: 'พรุ่งนี้ตื่นเช้า' },
    ],
  },
  {
    day: 3,
    weekday: 'เสาร์',
    date: '21 พ.ย.',
    route: 'Beppu → Aso → Kumamoto',
    driveInfo: 'ขับ ~190 กม. / 3.5 ชม. · วันหนักที่สุด · เติมน้ำมันก่อนขึ้นเขา',
    activities: [
      { time: '07:00', activity: 'ตื่น' },
      { time: '08:00', activity: 'Breakfast' },
      { time: '08:45', activity: 'Check-out' },
      { time: '09:00', activity: 'ออกเดินทาง', note: 'Yamanami Highway' },
      {
        time: '10:30–11:00',
        activity: 'Daikanbo',
        note: 'วิวแคลดีราอาโสะ อากาศเย็น เตรียมแจ็คเก็ต',
        starred: true,
      },
      { time: '11:15–12:00', activity: 'Kusasenri', note: 'ทุ่งหญ้า + ไอศกรีม', starred: true },
      { time: '12:00–12:45', activity: 'Aso Volcano Museum', note: 'เช็กสถานะปากปล่องล่วงหน้าที่เว็บ Aso' },
      { time: '13:00–14:00', activity: 'Lunch — Akaushi Beef' },
      { time: '14:15', activity: 'ออกเดินทาง' },
      { time: '15:45', activity: 'ถึง Kumamoto' },
      {
        time: '16:00–17:00',
        activity: 'Kumamoto Castle (ย้ายมาก่อน check-in)',
        note: 'ปิดรับเข้า 16:30 ต้องถึงก่อน',
        starred: true,
        alert: true,
      },
      { time: '17:15–18:15', activity: 'Sakuranobaba Josaien', note: 'ของฝาก + ของกิน' },
      { time: '18:30', activity: 'Check-in Airbnb', note: 'จอดรถ วางของ' },
      { time: '19:30', activity: 'Dinner — Basashi / Yakiniku' },
      { time: '21:30', activity: 'กลับที่พัก' },
    ],
    callout:
      'จุดเปลี่ยนหลักคือปราสาทก่อน check-in ถ้ารถติดถึงหลัง 16:15 ให้ตัดปราสาทไปดูจากด้านนอกที่ Josaien แทน แล้วไปเช้าวันที่ 4 ได้ (เปิด 09:00)',
  },
  {
    day: 4,
    weekday: 'อาทิตย์',
    date: '22 พ.ย.',
    route: 'Kumamoto → Fukuoka',
    driveInfo: 'ขับ ~110 กม. / 2 ชม. · วันคืนรถ',
    activities: [
      { time: '08:00', activity: 'Breakfast' },
      { time: '09:00', activity: 'Check-out' },
      { time: '09:15', activity: 'ออกเดินทาง', note: 'เติมน้ำมันเต็มถังก่อนคืนรถ', alert: true },
      { time: '11:15', activity: 'ถึง Fukuoka' },
      { time: '11:30', activity: 'คืนรถ 2 คัน', note: 'เช็กว่าสาขาคืนตรงกับที่จอง', starred: true },
      { time: '12:00', activity: 'ไปที่พัก ฝากกระเป๋า' },
      { time: '12:30', activity: 'Lunch' },
      { time: '13:30–16:00', activity: 'Canal City' },
      { time: '16:00–18:00', activity: 'Hakata Station / Amu Plaza', note: 'สำรวจไว้ก่อน ค่อยซื้อจริงวันที่ 6' },
      { time: '18:00', activity: 'Dinner' },
      { time: '20:00', activity: 'Nakasu Yatai', note: 'ร้านเล็ก 7 คนอาจต้องแยก 2 กลุ่ม', starred: true },
      { time: '22:00', activity: 'กลับที่พัก' },
    ],
  },
  {
    day: 5,
    weekday: 'จันทร์',
    date: '23 พ.ย.',
    route: 'Itoshima',
    driveInfo: 'รถไฟ + ต่อรถ · ไป-กลับ ~2 ชม.',
    activities: [
      { time: '08:00', activity: 'Breakfast' },
      { time: '08:45', activity: 'เดินไป Hakata Station' },
      { time: '09:12', activity: 'JR Chikuhi Line → Chikuzen-Maebaru', note: '~40 นาที' },
      { time: '09:55', activity: 'ถึงสถานี', note: 'ต่อบัส/แท็กซี่อีก ~25 นาที', alert: true },
      {
        time: '10:30–11:15',
        activity: 'Sakurai Futamigaura',
        note: 'เสาโทริอิกลางทะเล + คู่หินฟูฟุอิวะ',
        starred: true,
      },
      { time: '11:30–12:45', activity: 'Palm Beach / คาเฟ่ริมทะเล' },
      { time: '13:00–14:00', activity: 'Lunch' },
      { time: '14:00–15:15', activity: 'London Bus Cafe', note: 'ถ่ายรูป', starred: true },
      { time: '15:30', activity: 'กลับ Fukuoka' },
      { time: '17:00', activity: 'พักที่พัก / เดินเล่น Tenjin' },
      { time: '19:00', activity: 'Dinner' },
      { time: '20:30', activity: 'Nakasu Yatai (รอบสอง ถ้าอยาก)' },
      { time: '22:00', activity: 'กลับที่พัก' },
    ],
    callout: 'ต้องเช็กก่อน: วันจันทร์คาเฟ่หลายร้านในอิโตชิมะปิด — ถ้าปิด ให้สลับ Day 5 กับ Day 6 กลับ',
  },
  {
    day: 6,
    weekday: 'อังคาร',
    date: '24 พ.ย.',
    route: 'Shopping + ของฝาก',
    activities: [
      { time: '08:30', activity: 'Breakfast' },
      { time: '10:00–12:45', activity: 'LaLaport Fukuoka', note: 'กันดั้ม ν / Uniqlo / GU', starred: true },
      { time: '13:00–14:00', activity: 'Lunch' },
      { time: '14:00–17:00', activity: 'Tenjin', note: 'PARCO / Loft / Bic Camera', starred: true },
      { time: '17:00–18:15', activity: 'Donki', note: 'ของฝากราคาถูก ยา ขนม' },
      { time: '18:30–19:30', activity: 'Dinner — Ichiran HQ' },
      {
        time: '19:30–20:30',
        activity: 'Hakata Station / Amu Plaza',
        note: 'ของฝากรอบสุดท้าย ปิด ~21:00',
        starred: true,
      },
      { time: '20:30–22:00', activity: 'Pack กระเป๋า', note: 'ชั่งน้ำหนัก แยกของเหลว', starred: true },
      { time: '22:00', activity: 'นอน' },
    ],
  },
  {
    day: 7,
    weekday: 'พุธ',
    date: '25 พ.ย.',
    route: 'บินกลับ',
    activities: [
      { time: '05:45', activity: 'ตื่น' },
      { time: '06:15', activity: 'Check-out' },
      { time: '06:30', activity: 'Taxi ไปสนามบิน', note: 'ต้องจองคืนก่อน 7 คน + กระเป๋า = 3 คัน', alert: true },
      { time: '06:50', activity: 'ถึงสนามบิน' },
      { time: '07:00–07:30', activity: 'Check-in + โหลดกระเป๋า' },
      { time: '07:30–08:00', activity: 'ตม. ขาออก' },
      { time: '09:30', activity: 'บินกลับ' },
    ],
  },
]
```

- [ ] **Step 3: Verify types compile**

Run: `npm run type-check`
Expected: exits 0, no errors mentioning `trip.ts` or `fukuoka-trip.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/types/trip.ts src/data/fukuoka-trip.ts
git commit -m "Add Fukuoka trip itinerary data and types"
```

---

### Task 2: Presentational components (TripSummary, TripDaySchedule)

**Files:**
- Create: `src/components/fukuoka-trip/TripSummary.vue`
- Create: `src/components/fukuoka-trip/TripDaySchedule.vue`

**Interfaces:**
- Consumes: `TripMeta`, `TripDay`, `TripActivity` from `src/types/trip.ts` (Task 1)
- Produces: `TripSummary` component with prop `meta: TripMeta`; `TripDaySchedule` component with prop `day: TripDay`. Both consumed by `FukuokaTripView.vue` in Task 3.

- [ ] **Step 1: Create TripSummary**

`src/components/fukuoka-trip/TripSummary.vue`:

```vue
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
```

- [ ] **Step 2: Create TripDaySchedule**

`src/components/fukuoka-trip/TripDaySchedule.vue`:

```vue
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
```

- [ ] **Step 3: Verify types compile**

Run: `npm run type-check`
Expected: exits 0. (Neither component is imported anywhere yet, so this mainly catches syntax/type errors within the files themselves — full integration is verified in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/components/fukuoka-trip/TripSummary.vue src/components/fukuoka-trip/TripDaySchedule.vue
git commit -m "Add TripSummary and TripDaySchedule presentational components"
```

---

### Task 3: View, tool registration, routing, and verification

**Files:**
- Create: `src/views/fukuoka-trip/FukuokaTripView.vue`
- Modify: `src/tools.ts`
- Modify: `src/router/index.ts`

**Interfaces:**
- Consumes: `tripMeta`, `tripDays` from `src/data/fukuoka-trip.ts` (Task 1); `TripSummary`, `TripDaySchedule` from `src/components/fukuoka-trip/` (Task 2); `BackHomeLink` from `src/components/BackHomeLink.vue` (existing)

- [ ] **Step 1: Create the view**

`src/views/fukuoka-trip/FukuokaTripView.vue`:

```vue
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
```

- [ ] **Step 2: Register the tool**

Modify `src/tools.ts` — add a new entry to the `tools` array (after the existing `promptpay` entry):

```ts
  {
    id: 'fukuoka-trip',
    name: 'แพลนทริป Fukuoka',
    description: 'แผนเดินทาง 7 วัน Fukuoka → Yufuin → Beppu → Aso → Kumamoto',
    icon: 'pi pi-map',
    route: '/fukuoka-trip',
  },
```

- [ ] **Step 3: Add the route**

Modify `src/router/index.ts` — add a new route object to the `routes` array (after the existing `promptpay` route):

```ts
    {
      path: '/fukuoka-trip',
      name: 'fukuoka-trip',
      component: () => import('@/views/fukuoka-trip/FukuokaTripView.vue'),
    },
```

- [ ] **Step 4: Verify types compile**

Run: `npm run type-check`
Expected: exits 0, no errors.

- [ ] **Step 5: Start the dev server and verify in the browser**

Run: `npm run dev`, open the app, and check:
1. Home page shows a new "แพลนทริป Fukuoka" card with a `pi-map` icon; clicking it navigates to `/fukuoka-trip`.
2. The page shows `BackHomeLink` (on mobile width), the "แพลนทริป Fukuoka" heading, the `TripSummary` block (date range, route, "7 คน" / "รถเช่า 2 คัน"), then 7 accordion panels labeled Day 1–7.
3. Day 1's panel is expanded by default; clicking other day headers expands them (multiple can stay open at once).
4. Day 2 shows star icons next to the four Jigoku stops; Day 3's Kumamoto Castle row has an orange highlight and bold text, and the day's callout message ("จุดเปลี่ยนหลักคือ...") renders below the schedule; Day 5's callout about Monday closures renders similarly.
5. Toggle dark mode (moon/sun button in the header) — text and backgrounds stay readable, orange alert rows and the warning `Message` remain legible in both themes.
6. Resize to mobile width — `BackHomeLink` is visible, sidebar collapses into the drawer, accordion is usable one-handed.
7. Check the browser console — no errors or warnings.

- [ ] **Step 6: Commit**

```bash
git add src/views/fukuoka-trip/FukuokaTripView.vue src/tools.ts src/router/index.ts
git commit -m "Add Fukuoka trip planner view, tool registration, and route"
```

---

## Self-review notes

- **Spec coverage:** Trip meta, all 7 days with full activity data, `starred`/`alert` flags, day-level callouts (Day 3, Day 5), tool registration, routing, accordion layout with Day 1 default-expanded, dark mode / mobile usability — all covered across Tasks 1–3. Checklist and "what changed" table were explicitly out of scope per the spec and are not included.
- **Placeholder scan:** No TBD/TODO; all steps contain literal file contents or exact commands.
- **Type consistency:** `TripActivity`/`TripDay`/`TripMeta` field names match across Task 1 (definition), Task 2 (component props), and Task 3 (data consumption) — `meta: TripMeta`, `day: TripDay`, `activity.starred`/`activity.alert`/`activity.note`, `day.callout`/`day.driveInfo` are used identically everywhere they appear.
