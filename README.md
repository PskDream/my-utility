# My Utility

เว็บรวมเครื่องมือ (utility) เล็กๆ ที่ใช้บ่อย เริ่มจากเครื่องมือแรก: **สร้าง QR Code พร้อมเพย์**

## ฟีเจอร์

### PromptPay QR Generator

- กรอกเบอร์โทร (10 หลัก), เลขบัตรประชาชน/ภาษี (13 หลัก) หรือ e-Wallet ID (15 หลัก) แล้วสร้าง QR พร้อมเพย์ได้ทันที
- ระบุจำนวนเงินได้ (ไม่ระบุ = ให้ผู้จ่ายกรอกเอง)
- QR วางลงบน template ทางการของ Thai QR Payment พร้อมโลโก้ตรงกลางตามสเปก (ไม่เกิน 7% ของพื้นที่ QR, error correction level M)
- ดาวน์โหลดเป็นรูปภาพความละเอียดสูง (1000×1200px) ได้เลย
- จำเลขพร้อมเพย์ล่าสุดไว้ให้อัตโนมัติ (localStorage)
- รองรับ dark mode และ responsive ทุกขนาดจอ (mobile-first)

รองรับการเพิ่มเครื่องมือใหม่ในอนาคตผ่าน registry เดียว ดูรายละเอียดสถาปัตยกรรมได้ใน [CLAUDE.md](./CLAUDE.md)

## เทคโนโลยีที่ใช้

- [Vue 3](https://vuejs.org/) (`<script setup>`) + TypeScript
- [Vue Router](https://router.vuejs.org/) (history mode)
- [PrimeVue](https://primevue.org/) (Aura preset) สำหรับ UI components
- [Tailwind CSS v4](https://tailwindcss.com/) + [tailwindcss-primeui](https://github.com/primefaces/tailwindcss-primeui) สำหรับ styling
- [Vite](https://vite.dev/) เป็น build tool

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

## คำสั่งที่ใช้บ่อย

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รัน dev server |
| `npm run build` | type-check แล้ว build สำหรับ production |
| `npm run type-check` | ตรวจสอบ type ด้วย `vue-tsc` |
| `npm run preview` | preview production build ที่ build ไว้แล้ว |

## Deploy

Deploy บน [Vercel](https://vercel.com) — auto-detect เป็น Vite project มี `vercel.json` กำหนด rewrite สำหรับ client-side routing (Vue Router history mode) ไว้แล้ว ไม่ต้องตั้งค่า environment variables ใดๆ เพิ่ม

## สำหรับนักพัฒนา

ดูรายละเอียดสถาปัตยกรรม, convention, และ gotchas ที่ควรรู้ก่อนแก้โค้ดได้ที่ [CLAUDE.md](./CLAUDE.md)
