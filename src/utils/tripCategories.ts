import type { TripCategory, TripPriority } from '@/types/trip'

export const CATEGORY_INFO: Record<TripCategory, { emoji: string; label: string }> = {
  scenic: { emoji: '🌿', label: 'วิว' },
  walking: { emoji: '🚶', label: 'เดินเล่น' },
  food: { emoji: '🍜', label: 'ของกิน' },
  park: { emoji: '🌳', label: 'สวน' },
  cafe: { emoji: '☕', label: 'คาเฟ่' },
  local: { emoji: '🏘️', label: 'ท้องถิ่น' },
  onsen: { emoji: '♨️', label: 'ออนเซ็น' },
}

export const PRIORITY_INFO: Record<TripPriority, { label: string; emoji: string }> = {
  top: { label: 'ห้ามพลาด', emoji: '🥇' },
  secondary: { label: 'แนะนำ', emoji: '🥈' },
  optional: { label: 'ถ้ามีเวลา', emoji: '🥉' },
}
