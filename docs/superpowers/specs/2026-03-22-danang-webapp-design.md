# 峴港之旅 2026 — Web App Design Spec

**Date:** 2026-03-22
**Trip:** Da Nang, Vietnam · March 25–28, 2026
**Reference:** Based on Fukuoka 2025 web app (`/Users/john/work/john/fukuoka-2025/website/`)

---

## Overview

A personal travel web app for a solo Da Nang trip, mirroring the structure of the Fukuoka 2025 app. Built with Next.js 14, TypeScript, and Tailwind CSS. Language: Traditional Chinese throughout, with original place names preserved (Vietnamese, etc.).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 with custom color theme |
| Data | Static JSON files (no database) |
| Deployment | Vercel (free Hobby plan) |
| Persistence | `localStorage` (not needed for this trip; reserved for future) |

Project location: `/Users/john/work/john/DaNang-2026/website/`

---

## Color Theme

Defined in `tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `danang-deep` | `#0077B6` | Primary — nav, headings, card borders |
| `danang-sky` | `#00B4D8` | Secondary — gradients, highlights |
| `danang-light` | `#90E0EF` | Tertiary — subtle backgrounds |
| `danang-cream` | `#CAF0F8` | Page background |
| `danang-sand` | `#F4A261` | Accent — countdown badge, tags |

Gradient headers: `linear-gradient(to right, #0077B6, #00B4D8)`

**Background application:** `layout.tsx` applies `className="bg-danang-cream"` on the `<body>` tag. `globals.css` sets no background — Tailwind handles it.

---

## File Structure

```
website/
  app/
    layout.tsx              # Root layout — nav (client component), footer, bg
    globals.css
    page.tsx                # 行程表 (server component + client countdown child)
    food/page.tsx           # 美食指南 (server component)
    spa/page.tsx            # Spa 指南 (server component)
    map/page.tsx            # 地圖總覽 (server component)
    tips/page.tsx           # 注意事項 (server component)
    components/
      NavBar.tsx            # 'use client' — uses usePathname() for active link
      Countdown.tsx         # 'use client' — live countdown via new Date() in browser
    utils/
      googleMaps.ts         # getGoogleMapsUrl(address, name) utility (from Fukuoka)
  data/
    itinerary.json
    food.json
    spa.json
    tips.json
  types/
    index.ts                # All TypeScript interfaces
  tailwind.config.ts
  next.config.js
  tsconfig.json
  package.json
```

---

## TypeScript Interfaces (`types/index.ts`)

```ts
export interface ItineraryItem {
  time: string;
  activity: string;
  details?: string;
  icon?: string;
  address?: string;
  hours?: string;
  warning?: string;
  mustTry?: boolean;    // renders "必試" red badge
  backup?: string;
}

export interface DayItinerary {
  id: number;
  date: string;         // "2026-03-25"
  day: string;          // "第一天"
  weekday: string;      // "星期三" — intentionally hardcoded, not computed from date
  title: string;
  items: ItineraryItem[];
}

export interface FoodEntry {
  id: string;
  name: string;         // original Vietnamese name
  chineseName: string;
  category: string;     // "街頭小食" | "海鮮" | "咖啡" | etc.
  mustEat?: boolean;    // renders "必吃" tag
  day?: string;         // "第一天" | "第三天 (會安)" | etc.
  address: string;
  hours?: string;
  priceRange?: string;
  details: string;
  icon?: string;
  notes?: string;
}

export interface SpaEntry {
  id: string;
  name: string;
  services: string[];
  priceRange: string;
  duration: string;
  address: string;
  bookingNote?: string;
  backup?: string;
}

export interface TipSection {
  title: string;
  icon: string;
  items: string[];
}

export interface BudgetRow {
  category: string;
  dailyEstimate: string;
}

export interface TipsData {
  warnings: TipSection[];
  packingList: string[];
  apps: { name: string; description: string }[];
  transport: string[];
  budget: BudgetRow[];
  accommodation: { date: string; hotel: string }[];
}
```

---

## Navigation (`components/NavBar.tsx`)

`'use client'` component using `usePathname()` from `next/navigation` to apply an active style to the current page link.

```tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/', label: '行程表' },
  { href: '/food', label: '美食指南' },
  { href: '/spa', label: 'Spa 指南' },
  { href: '/map', label: '地圖總覽' },
  { href: '/tips', label: '注意事項' },
];
```

Active link: brighter/underlined style (e.g., `text-danang-sand font-bold underline`), inactive: `opacity-80 hover:text-danang-sand`.

Sticky top, `bg-danang-deep text-white`. On mobile: horizontal scrollable row.

---

## Footer (`layout.tsx`)

Shown on all pages:

```
峴港之旅 2026年3月25日 - 3月28日
住宿：Seashore Hotel & Apartment (3/25) · Mercure Da Nang (3/26–27)
```

`bg-danang-deep text-white`, centered text.

---

## Pages

### 1. 行程表 `/` (Itinerary)

**Server component.** Imports `DayItinerary[]` from `data/itinerary.json`. Renders a `<Countdown />` client component at the top; everything else is static.

**`<Countdown />` (`components/Countdown.tsx`):**
- `'use client'` — evaluates `new Date()` in the browser so the countdown is live, not frozen at build time
- Trip start: `2026-03-25`, end: `2026-03-28`
- States: before → "⏰ 還有 X 天", departure day → "🎉 今天出發！", during trip → "🌊 旅程進行中！", after → "感謝旅程的美好回憶 🌊"
- Badge styled with `bg-danang-sand text-white` pill

**Page layout:**
- Header: "峴港之旅行程表 🌊", date range, countdown badge
- 4 day cards (one per day), each:
  - Gradient header: day number, title, emoji, date + weekday
  - `weekday` is hardcoded in JSON (not derived from `date`) to avoid timezone issues in static generation
  - Activity list: time, icon, activity name, details, address link, hours, warning badge, mustTry badge
  - Address links use `getGoogleMapsUrl(address, activity)` → opens Google Maps in new tab
  - Hover shadow effect on card

**Data (`data/itinerary.json`):**

```json
[
  {
    "id": 1,
    "date": "2026-03-25",
    "day": "第一天",
    "weekday": "星期三",
    "title": "抵達 & 海灘初探",
    "items": [
      {
        "time": "下午",
        "activity": "抵達峴港國際機場 (DAD)",
        "details": "搭 Grab 至酒店，約 80,000–120,000 VND ($3–5)",
        "icon": "✈️"
      },
      {
        "time": "傍晚",
        "activity": "美溪海灘 (Mỹ Khê Beach)",
        "details": "沿海濱步道散步，天氣 25–29°C",
        "icon": "🏖️",
        "address": "Mỹ Khê Beach, Đà Nẵng"
      },
      {
        "time": "晚餐",
        "activity": "Bánh Xèo Bà Dưỡng",
        "details": "峴港著名脆煎餅，約 60,000–80,000 VND",
        "icon": "🥞",
        "address": "K280/23 Hoàng Diệu, Đà Nẵng",
        "mustTry": true
      }
    ]
  }
]
```

---

### 2. 美食指南 `/food` (Food Guide)

**Server component.**

**Layout:**
- Header: "峴港美食指南 🍜", subtitle "必吃美食 & 在地推薦"
- Food cards, each with:
  - Emoji icon, name (Vietnamese), Chinese name + description
  - Tags: "必吃" (if `mustEat`), day label (if `day`), category
  - Address → `getGoogleMapsUrl(address, name)` link ("📍 查看地圖 →")
  - Hours, price range, notes
- **Embedded map at bottom of page:** Google My Maps iframe (see Map section below)

**Data (`data/food.json`):**

```json
[
  {
    "id": "banh-xeo-ba-duong",
    "name": "Bánh Xèo Bà Dưỡng",
    "chineseName": "煎餅婆娘",
    "category": "街頭小食",
    "mustEat": true,
    "day": "第一天",
    "address": "K280/23 Hoàng Diệu, Đà Nẵng",
    "hours": "09:00–21:00",
    "priceRange": "60,000–80,000 VND",
    "details": "峴港著名脆煎餅，搭配烤豬肉串 (nem lụi)",
    "icon": "🥞"
  }
]
```

Address links are generated at render time using `getGoogleMapsUrl(entry.address, entry.name)`. No `mapsUrl` field in JSON.

---

### 3. Spa 指南 `/spa` (Spa Guide)

**Server component.**

**Layout:**
- Header: "Spa & 按摩指南 💆"
- Spa cards, each with:
  - Name, services list, price range, duration
  - Address → `getGoogleMapsUrl(address, name)` link
  - Booking note, backup option (if any)
- **Embedded map at bottom of page:** Google My Maps iframe (see Map section below)

**Data (`data/spa.json`):**

```json
[
  {
    "id": "palmarosa-spa",
    "name": "Palmarosa Spa",
    "services": ["越式按摩", "精油按摩", "臉部護理"],
    "priceRange": "$15–35 USD",
    "duration": "60–90 分鐘",
    "address": "64 Nguyễn Thị Minh Khai, Đà Nẵng",
    "bookingNote": "建議提前預約",
    "backup": "Herbal Spa"
  }
]
```

Address links use `getGoogleMapsUrl(entry.address, entry.name)`. No `mapsUrl` field.

---

### 4. 地圖總覽 `/map` (Map Overview)

**Server component.**

**Layout:**
- Header: "所有地點總覽 🗺️"
- One large embedded Google My Maps iframe showing all locations (all categories, colour-coded)
- Below the map: compact location list, grouped by category (行程景點 / 美食 / Spa), each item is a `getGoogleMapsUrl()` deep-link

**Filter buttons (client-side only):**
- Buttons: 全部 / 行程景點 / 美食 / Spa
- These buttons do NOT filter the map — they scroll the page to the corresponding section of the compact list below (using anchor links or `scrollIntoView`)
- Google My Maps does not support URL-level layer filtering, so the map always shows all pins. Filtering is list-only

**Map embed implementation:**
- One Google My Maps is created manually with all locations plotted and colour-coded by category (e.g., blue = 行程, orange = 美食, green = Spa)
- The published share embed URL is embedded as an `<iframe>` — no API key required
- The My Maps share URL looks like: `https://www.google.com/maps/d/embed?mid=XXXXXX`
- This URL is hardcoded in `/map/page.tsx`, `/food/page.tsx`, and `/spa/page.tsx` (same map, same URL, all three pages embed the same My Maps)
- On `/food` and `/spa` pages, the same map is embedded but is smaller in height; all pins are visible but only the relevant ones are obvious by colour

**Note:** The Google My Maps must be created before the app is deployed. All location data (itinerary spots, food, spa) must be added to it manually. This is a one-time setup task.

---

### 5. 注意事項 `/tips` (Tips & Notes)

**Server component.** All content sourced from `data/tips.json`.

**Layout:**
- Important warnings / notes (e.g., buy Ba Na Hills tickets online, Hoi An entry ticket)
- Packing list for March Da Nang weather
- Useful apps (Grab, Google Maps, Google Translate)
- Transport tips
- Budget overview table
- Accommodation summary

**Data (`data/tips.json`):**

```json
{
  "warnings": [
    {
      "title": "重要提醒",
      "icon": "⚠️",
      "items": [
        "巴拿山門票請提前在 booking.sunworld.vn 購買，可免排隊",
        "會安古城門票 120,000 VND，包含 5 個景點入場"
      ]
    }
  ],
  "packingList": [
    "輕便透氣衣物（天氣溫暖潮濕）",
    "薄外套（巴拿山海拔較高較涼，冷氣場所）",
    "舒適步行鞋（大理石山、會安石板路）"
  ],
  "apps": [
    { "name": "Grab", "description": "叫車首選，無語言障礙" },
    { "name": "Google Maps", "description": "建議下載離線地圖備用" },
    { "name": "Google Translate", "description": "相機翻譯功能對看菜單很有用" }
  ],
  "transport": [
    "機場至海灘區 Grab：約 80,000–120,000 VND ($3–5)",
    "峴港至會安 Grab：約 200,000–250,000 VND"
  ],
  "budget": [
    { "category": "餐飲", "dailyEstimate": "$15–25" },
    { "category": "交通 (Grab)", "dailyEstimate": "$10–15" },
    { "category": "活動 & 門票", "dailyEstimate": "$15–35" },
    { "category": "每日合計", "dailyEstimate": "~$40–75" }
  ],
  "accommodation": [
    { "date": "3月25日 (三)", "hotel": "Seashore Hotel & Apartment" },
    { "date": "3月26–27日 (四–五)", "hotel": "Mercure Da Nang (已確認)" }
  ]
}
```

---

## Google Maps Utility (`utils/googleMaps.ts`)

Carry over unchanged from Fukuoka app. Generates deep-link URLs:

```ts
export function getGoogleMapsUrl(address: string, name: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
```

Used everywhere addresses appear. No `mapsUrl` fields stored in JSON.

---

## Features Carried Over from Fukuoka

- Day card layout with gradient headers, left border, hover shadow
- Activity items: time, icon, badge, address link
- `getGoogleMapsUrl()` utility for all address links
- Responsive design (mobile-first, single-column → multi-column)
- Footer with trip dates and accommodation
- Static JSON data architecture

## New Features vs Fukuoka

- `<Countdown />` extracted as a `'use client'` component (fixes build-time date bug)
- `<NavBar />` extracted as a `'use client'` component with `usePathname()` active link highlighting
- Dedicated food guide page (`/food`)
- Dedicated spa guide page (`/spa`)
- Embedded Google My Maps iframe on food, spa, and map pages
- `/map` overview page with all pins + category-filtered list sections
- "必吃" / "必試" tags on food and itinerary items
- Day label tag on food cards

## Out of Scope

- Reservation progress tracker (Da Nang has no complex advance reservations like Fukuoka omakase)
- User authentication or backend
- Multi-language toggle
- Real-time map filtering (Google My Maps does not support it via URL)

---

## Itinerary Content (from existing markdown)

| Day | Date | Theme | Hotel |
|-----|------|-------|-------|
| 1 | Wed Mar 25 | 抵達 & 海灘初探 | Seashore Hotel & Apartment |
| 2 | Thu Mar 26 | 巴拿山 & 金橋 | Mercure Da Nang |
| 3 | Fri Mar 27 | 會安古城日遊 | Mercure Da Nang |
| 4 | Sat Mar 28 | 大理石山 & 出發 | — |
