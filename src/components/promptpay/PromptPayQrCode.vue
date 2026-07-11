<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import Button from 'primevue/button'
import promptPayBadgeUrl from '@/assets/promptpay-badge.png'
import templateUrl from '@/assets/thai-qr-payment-template.png'

const props = defineProps<{ payload: string; isPlaceholder?: boolean }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

function loadImage(src: string) {
  const img = new Image()
  img.src = src
  const ready =
    img.decode?.().catch(() => {}) ??
    new Promise<void>((resolve) => img.addEventListener('load', () => resolve()))
  return { img, ready }
}

const badge = loadImage(promptPayBadgeUrl)
const template = loadImage(templateUrl)

// ตำแหน่ง/ขนาดวาง QR อ้างอิงตาม template ทางการของ Thai QR Payment
// https://github.com/kittinan/thai-qr-payment/blob/main/thaiqrpayment/__init__.py
const TEMPLATE_WIDTH = 1000
const TEMPLATE_HEIGHT = 1200
const QR_SIZE = 750
const QR_X = 125
const QR_Y = 407

// ตามข้อกำหนด Thai QR Payment: ตราสัญลักษณ์ต้องไม่เกิน 7% ของพื้นที่ QR
// และใช้ระดับ Error Correction 15% (level "M") เพื่อรองรับพื้นที่ที่ถูกบัง
const MAX_LOGO_AREA_RATIO = 0.07

async function draw() {
  if (!canvasRef.value || !props.payload) return

  await Promise.all([badge.ready, template.ready])

  const canvas = canvasRef.value
  canvas.width = TEMPLATE_WIDTH
  canvas.height = TEMPLATE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(template.img, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT)

  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, props.payload, {
    width: QR_SIZE,
    margin: 1,
    errorCorrectionLevel: 'M',
  })

  const qrCtx = qrCanvas.getContext('2d')
  if (qrCtx) {
    const aspectRatio = badge.img.naturalWidth / badge.img.naturalHeight || 1
    const maxArea = QR_SIZE * QR_SIZE * MAX_LOGO_AREA_RATIO
    const badgeHeight = Math.sqrt(maxArea / aspectRatio)
    const badgeWidth = badgeHeight * aspectRatio
    const bx = (QR_SIZE - badgeWidth) / 2
    const by = (QR_SIZE - badgeHeight) / 2
    qrCtx.drawImage(badge.img, bx, by, badgeWidth, badgeHeight)
  }

  ctx.drawImage(qrCanvas, QR_X, QR_Y, QR_SIZE, QR_SIZE)
}

onMounted(draw)
watch(() => props.payload, draw)

function download() {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'promptpay-qr.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="relative inline-flex max-w-full">
      <canvas
        ref="canvasRef"
        class="h-auto w-full max-w-[280px] rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        :class="{ 'opacity-60 blur-[6px]': isPlaceholder }"
      />
      <div
        v-if="isPlaceholder"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-[0.9rem] text-[var(--p-text-color)]"
      >
        <span class="pi pi-qrcode text-[1.75rem]" />
        <span>กรอกหมายเลขพร้อมเพย์เพื่อสร้าง QR</span>
      </div>
    </div>
    <Button
      v-if="!isPlaceholder"
      label="ดาวน์โหลด QR"
      icon="pi pi-download"
      class="w-full max-w-[280px]"
      @click="download"
    />
  </div>
</template>
