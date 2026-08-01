# Fukuoka Trip Planner — Design Spec

Date: 2026-08-01

## Purpose

Add a new tool to my-utility: a read-only itinerary viewer for a specific upcoming trip (Fukuoka, Japan, 19–25 พ.ย., 7 คน, รถเช่า 2 คัน). Answers "ต้องไปที่ไหนบ้าง" — at a glance (summary) and in full day-by-day detail. Mobile-first since it'll be used while traveling.

## Scope decisions (from brainstorming)

- **Trip-specific, not a general trip-planning tool.** The itinerary is hardcoded data, not user-editable. No forms, no CRUD, no persistence.
- **Read-only.** No checkbox/"done" state, no notes editing.
- **Accordion layout**, one panel per day, for easy one-handed mobile use. Day 1 expanded by default, others collapsed. No auto-expand-today logic (trip is months away; adds complexity for no current benefit).
- **Includes:** a trip summary section at the top (date range, route, headline stats). **Excludes:** pre-trip checklist (IDP/ETC/eSIM/insurance) and the "what changed from previous version" comparison table — out of scope for this pass.

## Data model

New file `src/types/trip.ts`:

```ts
export interface TripActivity {
  time: string
  activity: string
  note?: string
  starred?: boolean // ⭐ must-see highlight
  alert?: boolean // time-critical warning row (e.g. "ต้องถึงก่อน 16:30")
}

export interface TripDay {
  day: number
  weekday: string // "พฤหัส"
  date: string // "19 พ.ย."
  route: string // "Fukuoka → Yufuin"
  driveInfo?: string // "ขับ ~120 กม. / 2 ชม. · Oita Expressway"
  activities: TripActivity[]
  callout?: string // day-level warning block, e.g. Day 3 castle reroute note
}

export interface TripMeta {
  title: string
  dateRange: string
  routeSummary: string
  stats: string[]
}
```

## Data content

Hardcoded in `src/data/fukuoka-trip.ts` as `tripMeta: TripMeta` + `tripDays: TripDay[]`, transcribed from the itinerary below (source of truth for implementation).

**Trip meta:**
- title: "แพลนทริป Fukuoka"
- dateRange: "19–25 พ.ย. (7 วัน 6 คืน)"
- routeSummary: "Fukuoka → Yufuin → Beppu → Aso → Kumamoto → Fukuoka (+ Itoshima day trip)"
- stats: ["7 คน", "รถเช่า 2 คัน"]

**Day 1 — พฤหัส 19 พ.ย. | Fukuoka → Yufuin** (ขับ ~120 กม. / 2 ชม. · Oita Expressway)
| เวลา | กิจกรรม | หมายเหตุ |
|---|---|---|
| 07:35 | ถึงสนามบิน Fukuoka (ตึก International) | |
| 07:35–08:20 | ตม. + รับกระเป๋า | 7 คนใช้เวลา เผื่อไว้ 45 นาที |
| 08:20–09:00 | รับรถเช่า 2 คัน | เช็ครอบรถ ตั้ง ETC ตั้ง Google Maps |
| 09:00–09:30 | Lawson ซื้ออาหารเช้า + น้ำ | เข้าห้องน้ำให้เรียบร้อย |
| 09:30 | ออกเดินทาง | |
| 10:45–11:00 | แวะ SA (Yamada / Kusu) | จุดนัดรวมรถ 2 คัน |
| 11:45 | ถึง Yufuin | |
| 12:00 | ฝากกระเป๋าที่พัก | |
| 12:15–13:30 | Lunch — Yufu Mabushi Shin | คิวยาว ถ้าเกิน 30 นาที เปลี่ยนร้าน |
| 13:30–16:30 | Yunotsubo Street | Snoopy / Miffy / Ghibli / ของฝาก |
| 16:30–17:15 | Kinrin Lake | พระอาทิตย์ตก ~17:15 |
| 17:30 | Check-in Airbnb | |
| 19:00 | Dinner — Yakiniku / Izakaya | Bungo Beef |
| 21:00 | กลับที่พัก | นอนเร็ว วันนี้ทุกคนบินข้ามคืนมา |

**Day 2 — ศุกร์ 20 พ.ย. | Yufuin → Beppu** (ขับ ~25 กม. / 45 นาที · วันสบายที่สุด)
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 07:30 | ตื่น | | |
| 08:00 | Breakfast | | |
| 09:00 | Check-out | | |
| 09:10–10:00 | คาเฟ่ Yufuin | | |
| 10:00 | ออกเดินทาง | ทาง Yamanami Highway วิวสวย | |
| 10:45 | ถึง Beppu | | |
| 11:00–11:50 | Umi Jigoku | บ่อสวยสุด ใช้เวลานานหน่อยได้ | starred |
| 12:00–12:50 | Kamado Jigoku | มีไข่ต้มบ่อน้ำร้อน / พุดดิ้ง | starred |
| 13:00–14:00 | Lunch | Toriten | |
| 14:00–14:45 | Oniishibozu Jigoku | เดินจาก Umi ได้ (3 บ่อนี้อยู่โซนเดียวกัน) | starred |
| 15:00–15:45 | Chinoike Jigoku | อยู่คนละโซน ขับ ~15 นาที | starred |
| 16:00 | Check-in Airbnb | ทุกบ่อปิด 17:00 | |
| 17:30 | ไป Hyotan Onsen | | |
| 17:45–20:00 | แช่ออนเซ็น | Outdoor / Waterfall / Steam | |
| 20:15 | Dinner | Seafood | |
| 22:00 | นอน | พรุ่งนี้ตื่นเช้า | |

**Day 3 — เสาร์ 21 พ.ย. | Beppu → Aso → Kumamoto** (ขับ ~190 กม. / 3.5 ชม. · วันหนักที่สุด · เติมน้ำมันก่อนขึ้นเขา)
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 07:00 | ตื่น | | |
| 08:00 | Breakfast | | |
| 08:45 | Check-out | | |
| 09:00 | ออกเดินทาง | Yamanami Highway | |
| 10:30–11:00 | Daikanbo | วิวแคลดีราอาโสะ อากาศเย็น เตรียมแจ็คเก็ต | starred |
| 11:15–12:00 | Kusasenri | ทุ่งหญ้า + ไอศกรีม | starred |
| 12:00–12:45 | Aso Volcano Museum | เช็กสถานะปากปล่องล่วงหน้าที่เว็บ Aso | |
| 13:00–14:00 | Lunch — Akaushi Beef | | |
| 14:15 | ออกเดินทาง | | |
| 15:45 | ถึง Kumamoto | | |
| 16:00–17:00 | Kumamoto Castle (ย้ายมาก่อน check-in) | ปิดรับเข้า 16:30 ต้องถึงก่อน | starred, alert |
| 17:15–18:15 | Sakuranobaba Josaien | ของฝาก + ของกิน | |
| 18:30 | Check-in Airbnb | จอดรถ วางของ | |
| 19:30 | Dinner — Basashi / Yakiniku | | |
| 21:30 | กลับที่พัก | | |

callout: "จุดเปลี่ยนหลักคือปราสาทก่อน check-in ถ้ารถติดถึงหลัง 16:15 ให้ตัดปราสาทไปดูจากด้านนอกที่ Josaien แทน แล้วไปเช้าวันที่ 4 ได้ (เปิด 09:00)"

**Day 4 — อาทิตย์ 22 พ.ย. | Kumamoto → Fukuoka** (ขับ ~110 กม. / 2 ชม. · วันคืนรถ)
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 08:00 | Breakfast | | |
| 09:00 | Check-out | | |
| 09:15 | ออกเดินทาง | เติมน้ำมันเต็มถังก่อนคืนรถ | alert |
| 11:15 | ถึง Fukuoka | | |
| 11:30 | คืนรถ 2 คัน | เช็กว่าสาขาคืนตรงกับที่จอง | starred |
| 12:00 | ไปที่พัก ฝากกระเป๋า | | |
| 12:30 | Lunch | | |
| 13:30–16:00 | Canal City | | |
| 16:00–18:00 | Hakata Station / Amu Plaza | สำรวจไว้ก่อน ค่อยซื้อจริงวันที่ 6 | |
| 18:00 | Dinner | | |
| 20:00 | Nakasu Yatai | ร้านเล็ก 7 คนอาจต้องแยก 2 กลุ่ม | starred |
| 22:00 | กลับที่พัก | | |

**Day 5 — จันทร์ 23 พ.ย. | Itoshima** (รถไฟ + ต่อรถ · ไป-กลับ ~2 ชม.)
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 08:00 | Breakfast | | |
| 08:45 | เดินไป Hakata Station | | |
| 09:12 | JR Chikuhi Line → Chikuzen-Maebaru | ~40 นาที | |
| 09:55 | ถึงสถานี | ต่อบัส/แท็กซี่อีก ~25 นาที | alert |
| 10:30–11:15 | Sakurai Futamigaura | เสาโทริอิกลางทะเล + คู่หินฟูฟุอิวะ | starred |
| 11:30–12:45 | Palm Beach / คาเฟ่ริมทะเล | | |
| 13:00–14:00 | Lunch | | |
| 14:00–15:15 | London Bus Cafe | ถ่ายรูป | starred |
| 15:30 | กลับ Fukuoka | | |
| 17:00 | พักที่พัก / เดินเล่น Tenjin | | |
| 19:00 | Dinner | | |
| 20:30 | Nakasu Yatai (รอบสอง ถ้าอยาก) | | |
| 22:00 | กลับที่พัก | | |

callout: "ต้องเช็กก่อน: วันจันทร์คาเฟ่หลายร้านในอิโตชิมะปิด — ถ้าปิด ให้สลับ Day 5 กับ Day 6 กลับ"

**Day 6 — อังคาร 24 พ.ย. | Shopping + ของฝาก**
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 08:30 | Breakfast | | |
| 10:00–12:45 | LaLaport Fukuoka | กันดั้ม ν / Uniqlo / GU | starred |
| 13:00–14:00 | Lunch | | |
| 14:00–17:00 | Tenjin | PARCO / Loft / Bic Camera | starred |
| 17:00–18:15 | Donki | ของฝากราคาถูก ยา ขนม | |
| 18:30–19:30 | Dinner — Ichiran HQ | | |
| 19:30–20:30 | Hakata Station / Amu Plaza | ของฝากรอบสุดท้าย ปิด ~21:00 | starred |
| 20:30–22:00 | Pack กระเป๋า | ชั่งน้ำหนัก แยกของเหลว | starred |
| 22:00 | นอน | | |

**Day 7 — พุธ 25 พ.ย. | บินกลับ**
| เวลา | กิจกรรม | หมายเหตุ | flags |
|---|---|---|---|
| 05:45 | ตื่น | | |
| 06:15 | Check-out | | |
| 06:30 | Taxi ไปสนามบิน | ต้องจองคืนก่อน 7 คน + กระเป๋า = 3 คัน | alert |
| 06:50 | ถึงสนามบิน | | |
| 07:00–07:30 | Check-in + โหลดกระเป๋า | | |
| 07:30–08:00 | ตม. ขาออก | | |
| 09:30 | บินกลับ | | |

## Components / files

- `src/tools.ts` — add `{ id: 'fukuoka-trip', name: 'แพลนทริป Fukuoka', description: 'แผนเดินทาง 7 วัน Fukuoka → Yufuin → Beppu → Aso → Kumamoto', icon: 'pi pi-map', route: '/fukuoka-trip' }`
- `src/router/index.ts` — add route `/fukuoka-trip` → `views/fukuoka-trip/FukuokaTripView.vue`
- `src/types/trip.ts` — `TripActivity`, `TripDay`, `TripMeta` interfaces
- `src/data/fukuoka-trip.ts` — `tripMeta: TripMeta`, `tripDays: TripDay[]` (content above)
- `src/views/fukuoka-trip/FukuokaTripView.vue` — `BackHomeLink`, `<h1>`, `TripSummary`, PrimeVue `Accordion` (v4: `Accordion` + `AccordionPanel`/`AccordionHeader`/`AccordionContent`) with one panel per `TripDay`, header shows day/date/route/driveInfo, content renders `TripDaySchedule`
- `src/components/fukuoka-trip/TripSummary.vue` — props: `meta: TripMeta`; shows date range, route as wrapped badges/pills, stats
- `src/components/fukuoka-trip/TripDaySchedule.vue` — props: `day: TripDay`; renders activity rows (time/activity/note), star icon for `starred`, orange highlight for `alert`, and a `Message severity="warn"` for `day.callout` if present

## Styling

Tailwind utility classes only (no `<style>` blocks), consistent with existing PromptPay views. PrimeVue components used: `Accordion`/`AccordionPanel`/`AccordionHeader`/`AccordionContent`, `Card` or plain div for summary, `Message` for callouts, `Tag` (or plain span) for route badges/starred icon.

## Out of scope

- Editing/adding trips or activities
- Persistence / localStorage
- Pre-trip checklist section
- "What changed" comparison table
- Auto-expanding "today's" accordion panel based on current date
