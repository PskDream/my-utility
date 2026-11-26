export interface SplitTx {
  date: string // YYYY-MM-DD
  name: string
  category: string
  total: number
  payer: string
  /** ส่วนที่แต่ละคนต้องรับผิดชอบจริง (index ตรงกับ people) */
  shares: number[]
  /** หารเท่ากันทั้งกลุ่ม */
  equal: boolean
  /** index ใน GROUPS */
  group: number
}

export interface SplitData {
  people: string[]
  txs: SplitTx[]
}

export const GROUPS = [
  'เครื่องบิน',
  'ที่พัก',
  'รถเช่า/น้ำมัน/ทางด่วน',
  'แท็กซี่/รถสาธารณะ',
  'อาหาร',
  'ประกันเดินทาง',
  'ช้อปปิ้ง/อื่นๆ',
] as const

const OTHER_GROUP = GROUPS.length - 1

const GROUP_BY_CATEGORY: Record<string, number> = {
  เครื่องบิน: 0,
  ค่าเช่า: 1,
  รถยนต์: 2,
  'น้ำมัน/เชื้อเพลิงรถ': 2,
  'การคมนาคม - อื่นๆ': 2,
  จอดรถ: 2,
  แท็กซี่: 3,
  'รถเมล์/รถไฟ': 3,
  ทานข้าวนอกบ้าน: 4,
  'อาหารและเครื่องดื่ม - อื่นๆ': 4,
  ประกัน: 5,
}

const PAYMENT_CATEGORIES = new Set(['การชำระเงิน', 'Payment'])

/** สีประจำคน (ลำดับคงที่) ให้ Tailwind สแกนเจอเป็นสตริงเต็ม */
const PERSON_COLORS = [
  'bg-[#2a78d6] dark:bg-[#3987e5]',
  'bg-[#eb6834] dark:bg-[#d95926]',
  'bg-[#1baf7a] dark:bg-[#199e70]',
  'bg-[#eda100] dark:bg-[#c98500]',
  'bg-[#e87ba4] dark:bg-[#d55181]',
  'bg-[#008300] dark:bg-[#0ca30c]',
  'bg-[#6250d6] dark:bg-[#9085e9]',
  'bg-[#e34948] dark:bg-[#e66767]',
]

export function personColor(index: number): string {
  return PERSON_COLORS[index] ?? 'bg-gray-400'
}

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

export function fmtDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1] ?? ''}`
}

export const f0 = (n: number) => Math.round(n).toLocaleString('en-US')
export const f2 = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** CSV parser รองรับเครื่องหมายคำพูด, BOM และ CRLF */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"'
          i++
        } else quoted = false
      } else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      cell = ''
      rows.push(row)
      row = []
    } else cell += ch
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

/**
 * แปลงไฟล์ Splitwise export. คอลัมน์ 6 เป็นต้นไปคือยอดสุทธิ (จ่าย - ส่วนของตัวเอง) ของแต่ละคน
 * ส่วนของแต่ละคน = -สุทธิ ยกเว้นคนที่จ่าย: ส่วน = ยอดรวม - สุทธิ
 */
export function parseSplitwise(text: string): SplitData {
  const rows = parseCsv(text)
  const header = rows[0]
  if (!header || header.length < 7) throw new Error('ไม่ใช่ไฟล์ Splitwise export (ต้องมีคอลัมน์รายชื่อคน)')
  const people = header.slice(5).map((p) => p.trim())
  const txs: SplitTx[] = []

  for (const r of rows.slice(1)) {
    if (r.length < 5 + people.length) continue
    const [date, name, category, rawTotal] = r
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) continue
    if (!category?.trim() || PAYMENT_CATEGORIES.has(category.trim())) continue
    const total = Number(rawTotal)
    const net = r.slice(5, 5 + people.length).map(Number)
    if (!Number.isFinite(total) || net.some((n) => !Number.isFinite(n))) continue

    const payerIdx = net.indexOf(Math.max(...net))
    const shares = net.map((n) => Math.round(-n * 100) / 100)
    shares[payerIdx] = Math.round((total - net[payerIdx]!) * 100) / 100

    const involved = shares.filter((s) => s > 0.005)
    const equal =
      involved.length === people.length && Math.max(...involved) - Math.min(...involved) <= 1

    txs.push({
      date,
      name: name!.trim(),
      category: category.trim(),
      total,
      payer: people[payerIdx]!,
      shares,
      equal,
      group: GROUP_BY_CATEGORY[category.trim()] ?? OTHER_GROUP,
    })
  }

  if (!txs.length) throw new Error('ไม่พบรายการค่าใช้จ่ายในไฟล์')
  return { people, txs }
}
