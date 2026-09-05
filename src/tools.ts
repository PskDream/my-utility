import type { Tool } from '@/types/tool'

export const tools: Tool[] = [
  {
    id: 'promptpay',
    name: 'PromptPay QR',
    description: 'สร้าง QR Code พร้อมเพย์ระบุจำนวนเงิน',
    icon: 'pi pi-qrcode',
    route: '/promptpay',
  },
  {
    id: 'fukuoka-trip',
    name: 'แพลนทริป Kyushu',
    description: 'แผนเดินทาง 7 วัน Fukuoka → Yufuin → Beppu → Aso → Kumamoto → Itoshima',
    icon: 'pi pi-map',
    route: '/fukuoka-trip',
  },
]
