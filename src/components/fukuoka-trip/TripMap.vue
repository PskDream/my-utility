<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import SelectButton from 'primevue/selectbutton'
import type { TripDay } from '@/types/trip'
import { tripCoords, tripMapcodes } from '@/data/fukuoka-trip-coords'
import { googleMapsUrl } from '@/utils/maps'

const props = defineProps<{ days: TripDay[] }>()

const DAY_COLORS = ['#e11d48', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#4f46e5', '#9333ea']

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

interface MapStop {
  coords: [number, number]
  time: string
  activity: string
  mapQuery: string
}

// จุดของแต่ละวันตามลำดับเวลา — ตัดจุดซ้ำติดกัน (เช่น Mameda-machi ที่ไปสองช่วง)
const stopsByDay = computed(() =>
  props.days.map((day) => {
    const stops: MapStop[] = []
    for (const activity of day.activities) {
      const coords = activity.mapQuery ? tripCoords[activity.mapQuery] : undefined
      if (!coords || !activity.mapQuery) continue
      const last = stops[stops.length - 1]
      if (last && last.coords[0] === coords[0] && last.coords[1] === coords[1]) continue
      stops.push({ coords, time: activity.time, activity: activity.activity, mapQuery: activity.mapQuery })
    }
    return stops
  }),
)

const ALL = 'all'
// ใช้ร่วมกับตารางรายวันด้านล่าง — กดวันที่แผนที่แล้วรายละเอียดเปลี่ยนตาม
const selectedDay = defineModel<string>({ default: ALL })
const dayOptions = computed(() => [
  { label: 'ทั้งหมด', value: ALL },
  ...props.days.map((day) => ({ label: `Day ${day.day}`, value: String(day.day) })),
])

const mapEl = ref<HTMLDivElement>()
let map: L.Map | undefined
const routeLayer = L.layerGroup()

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function drawRoute() {
  if (!map) return
  routeLayer.clearLayers()
  const bounds = L.latLngBounds([])

  stopsByDay.value.forEach((stops, index) => {
    const day = props.days[index]
    if (!day || stops.length === 0) return
    if (selectedDay.value !== ALL && selectedDay.value !== String(day.day)) return
    const color = DAY_COLORS[index % DAY_COLORS.length]

    // เริ่มเส้นจากจุดสุดท้ายของวันก่อนหน้า (ที่พักเมื่อคืน) ให้เส้นทางต่อเนื่อง
    const previousStops = stopsByDay.value[index - 1]
    const previousEnd = previousStops?.[previousStops.length - 1]
    const line = [...(previousEnd ? [previousEnd.coords] : []), ...stops.map((stop) => stop.coords)]
    L.polyline(line, { color, weight: 3, opacity: 0.8, dashArray: '6 6' }).addTo(routeLayer)

    stops.forEach((stop, stopIndex) => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[0.7rem] font-bold text-white shadow-md" style="background:${color}">${stopIndex + 1}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      })
      L.marker(stop.coords, { icon, title: stop.activity })
        .bindPopup(
          `<div class="text-[0.8rem]" style="color:${color}"><b>Day ${day.day}</b> · ${escapeHtml(stop.time)}</div>` +
            `<div class="my-1 text-[0.9rem] font-semibold">${escapeHtml(stop.activity)}</div>` +
            (tripMapcodes[stop.mapQuery]
              ? `<div class="mb-1 text-[0.8rem]">🚗 Mapcode <b class="font-mono select-all">${escapeHtml(tripMapcodes[stop.mapQuery]!.code)}</b></div>`
              : '') +
            `<a href="${googleMapsUrl(stop.mapQuery)}" target="_blank" rel="noopener">เปิดใน Google Maps</a>`,
        )
        .addTo(routeLayer)
      bounds.extend(stop.coords)
    })
  })

  if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 })
}

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, { scrollWheelZoom: false })
  routeLayer.addTo(map)
  L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map)
  drawRoute()
})

onBeforeUnmount(() => {
  map?.remove()
  map = undefined
})

watch(selectedDay, drawRoute)
</script>

<template>
  <div class="mb-6 flex flex-col gap-3">
    <h2 class="text-lg font-semibold">แผนที่การเดินทาง</h2>
    <div class="overflow-x-auto">
      <SelectButton
        v-model="selectedDay"
        :options="dayOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        size="small"
        class="whitespace-nowrap"
      />
    </div>
    <!-- โหมดมืด: กลับสีแผนที่ผ่าน wrapper — ห้ามใส่ class นี้ที่ div ของ Leaflet โดยตรงถ้าจะทำเป็น :class
         เพราะ Vue จะเขียนทับ class leaflet-* ที่ Leaflet เพิ่มเอง -->
    <div
      class="dark:[&_.leaflet-tile-pane]:brightness-90 dark:[&_.leaflet-tile-pane]:hue-rotate-180 dark:[&_.leaflet-tile-pane]:invert"
    >
      <div
        ref="mapEl"
        class="isolate h-[420px] w-full overflow-hidden rounded-lg border border-[var(--p-content-border-color)] sm:h-[520px]"
      />
    </div>
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-[var(--p-text-muted-color)]">
      <span v-for="(day, index) in days" :key="day.day" class="flex items-center gap-1.5">
        <span class="inline-block h-2.5 w-2.5 rounded-full" :style="{ background: DAY_COLORS[index % DAY_COLORS.length] }" />
        Day {{ day.day }} · {{ day.route }}
      </span>
    </div>
    <p class="text-[0.75rem] text-[var(--p-text-muted-color)]">
      เส้นประเชื่อมจุดตามลำดับเวลา ไม่ใช่เส้นทางถนนจริง · พิกัดเป็นค่าโดยประมาณ — กดหมุดเพื่อเปิดใน Google Maps
    </p>
  </div>
</template>
