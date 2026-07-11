# my-utility

Multi-tool utility web app (Vue 3 + Vite). First tool: PromptPay QR generator.

## Commands

```bash
npm run dev          # dev server (vite)
npm run build         # vue-tsc -b && vite build
npm run type-check    # vue-tsc -b only
npm run preview       # preview production build
```

## Stack

- Vue 3 `<script setup>` + TypeScript, Vue Router (`createWebHistory`)
- PrimeVue v4 (`primevue` + `@primeuix/themes`, Aura preset) for components
- Tailwind CSS v4 (`@tailwindcss/vite`) + `tailwindcss-primeui` for utility styling — **no `<style>` blocks in `.vue` files**, everything is Tailwind classes in the template
- Dark mode: `useDarkMode.ts` composable toggles `.my-app-dark` class on `<html>`; PrimeVue's `darkModeSelector` and Tailwind's `@custom-variant dark` (in `main.css`) both key off that same class

## Architecture: adding a new tool

Tools are registered once and drive both the sidebar nav and the home page grid:

1. Add an entry to `src/tools.ts` (`id`, `name`, `description`, `icon`, `route`)
2. Add the route in `src/router/index.ts`
3. Create `src/views/<tool>/<Tool>View.vue`, put a `<BackHomeLink />` above the heading (mobile-only back link, auto-hidden on desktop via the sidebar)
4. Break the view into `src/components/<tool>/` pieces as needed (see `components/promptpay/` for the pattern: `*Form.vue` + `*QrCode.vue`)

Layout shell (`DefaultLayout.vue`) handles the responsive sidebar (drawer on mobile, static column ≥768px) — views don't need their own page chrome.

## PromptPay QR generator specifics

- `src/utils/promptpay.ts` wraps the `promptpay-qr` package; accepts phone (10 digits), citizen/tax ID (13), or e-Wallet ID (15), with or without spaces/dashes
- QR is rendered onto the official Thai QR Payment template (`src/assets/thai-qr-payment-template.png`, 1000×1200px) using exact placement from the [reference implementation](https://github.com/kittinan/thai-qr-payment): QR pasted at `(125, 407)` sized `750×750`
- Center badge overlay: capped at 7% of QR area, QR uses error-correction level `M` (~15% recovery) — both required to keep the badge from breaking scannability
- The same `<canvas>` is used for on-screen display and the downloaded PNG (`canvas.toDataURL()` directly) — no separate export canvas
- Last-used PromptPay ID persists to `localStorage` (`my-utility:promptpay-id`); amount does not persist (it's transaction-specific)

## Conventions

- **No test suite.** There are no `*.test.*`/`*.spec.*` files or test runner configured. Don't assume TDD workflow or go looking for a test command that doesn't exist.
- **No global state library (Pinia).** Dark mode uses a plain composable (`useDarkMode.ts`) + `localStorage`. Only reach for Pinia if a future tool genuinely needs state shared across tools.
- **UI text is entirely in Thai** (labels, buttons, validation messages). Match that when adding new tools — don't default to English.
- **Icons are PrimeIcons only** (`pi pi-*` classes, e.g. `tools.ts`'s `icon` field, sidebar, buttons). No separate icon library.

## Gotchas

- **Never bind reactive `:width`/`:height` on a `<canvas>` that's also drawn to imperatively.** Setting a canvas's `width`/`height` property clears its contents immediately — if Vue's reactivity patches those attributes after `ctx.drawImage(...)` runs, the drawing vanishes. Let the Canvas API (`QRCode.toCanvas`, or setting `canvas.width` yourself synchronously at the top of the draw function) be the sole owner of sizing.
- **Don't use PrimeVue `InputNumber` for ID-like fields** (phone numbers, tax IDs). Its `modelValue` is a real `number`, so leading zeros are silently stripped (`0812345678` → `812345678`). Use `InputText` with `inputmode="numeric"` instead — keeps the string intact and still shows a numeric keyboard on mobile.
- **Tailwind v4's Preflight strips default heading styles** (`<h1>` etc. lose browser-default font-size/weight/margin). Any raw heading tag needs explicit utility classes or it'll render as plain text.
- **`body` needs an explicit `background`/`color`** (see `main.css`) tied to `var(--p-content-background)` / `var(--p-text-color)`. Relying on the UA's implicit `color-scheme`-based canvas painting is unreliable when toggling light/dark — it can leave stale background color after a mode switch.
- **Stray `vite.config.js` / `vite.config.d.ts` in repo root**: `tsconfig.node.json` extends `@tsconfig/node22` which doesn't set `noEmit`, so `vue-tsc -b` emits compiled output for `vite.config.ts` into the project root. Safe to delete; not yet gitignored.

## Deployment

Vercel. `vercel.json` has a catch-all rewrite to `/index.html` — required because Vue Router uses history mode (`createWebHistory`), so any non-root path needs SPA fallback or it 404s on direct load/refresh. Framework preset auto-detects as Vite; no env vars needed.
