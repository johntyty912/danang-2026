# 峴港之旅 2026 Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-page Next.js 14 travel web app for a Da Nang solo trip (Mar 25–28, 2026) with itinerary, food guide, spa guide, map overview, and tips pages — modelled on the Fukuoka 2025 app.

**Architecture:** Static Next.js 14 app (App Router, `output: 'export'`) with JSON data files. Two `'use client'` components (NavBar with active link detection, Countdown with live date). Google My Maps iframes for embedded maps (no API key needed). All other pages are server components.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS 3.4, static JSON data, Vercel deployment

**Reference app:** `/Users/john/work/john/fukuoka-2025/website/` — read this when in doubt about patterns.

**Spec:** `/Users/john/work/john/DaNang-2026/docs/superpowers/specs/2026-03-22-danang-webapp-design.md`

---

## File Map

```
website/                          ← project root
  app/
    layout.tsx                    ← root layout: NavBar + footer + bg
    globals.css                   ← Tailwind directives only, no background
    page.tsx                      ← 行程表 (itinerary, server component)
    food/page.tsx                 ← 美食指南 (food guide, server component)
    spa/page.tsx                  ← Spa 指南 (spa guide, server component)
    map/page.tsx                  ← 地圖總覽 (map overview, server component)
    tips/page.tsx                 ← 注意事項 (tips, server component)
    components/
      NavBar.tsx                  ← 'use client' — sticky nav with active link
      Countdown.tsx               ← 'use client' — live countdown badge
      MapFilters.tsx              ← 'use client' — category scroll buttons for /map
  data/
    itinerary.json                ← DayItinerary[]
    food.json                     ← FoodEntry[]
    spa.json                      ← SpaEntry[]
    tips.json                     ← TipsData
  types/
    index.ts                      ← all TypeScript interfaces
  utils/
    googleMaps.ts                 ← getGoogleMapsUrl() utility
  tailwind.config.ts
  next.config.js
  tsconfig.json
  postcss.config.js
  package.json
  .gitignore
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `website/package.json`
- Create: `website/next.config.js`
- Create: `website/tsconfig.json`
- Create: `website/postcss.config.js`
- Create: `website/.gitignore`

- [ ] **Step 1: Create `website/package.json`**

```json
{
  "name": "danang-2026-itinerary",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.33",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `website/next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **Step 3: Create `website/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `website/postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create `website/.gitignore`**

```
node_modules/
.next/
out/
```

- [ ] **Step 6: Install dependencies**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/package.json website/next.config.js website/tsconfig.json website/postcss.config.js website/.gitignore
git commit -m "feat: scaffold Next.js 14 project for Da Nang web app"
```

---

## Task 2: Tailwind Config + Types + Utility

**Files:**
- Create: `website/tailwind.config.ts`
- Create: `website/app/globals.css`
- Create: `website/types/index.ts`
- Create: `website/utils/googleMaps.ts`

- [ ] **Step 1: Create `website/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danang: {
          deep: '#0077B6',
          sky: '#00B4D8',
          light: '#90E0EF',
          cream: '#CAF0F8',
          sand: '#F4A261',
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Create `website/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create `website/types/index.ts`**

```ts
export interface ItineraryItem {
  time: string;
  activity: string;
  details?: string;
  icon?: string;
  address?: string;
  hours?: string;
  warning?: string;
  mustTry?: boolean;
  backup?: string;
}

export interface DayItinerary {
  id: number;
  date: string;
  day: string;
  weekday: string; // intentionally hardcoded, not computed from date
  title: string;
  items: ItineraryItem[];
}

export interface FoodEntry {
  id: string;
  name: string;         // original Vietnamese name
  chineseName: string;
  category: string;
  mustEat?: boolean;
  day?: string;
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

- [ ] **Step 4: Create `website/utils/googleMaps.ts`**

```ts
export function getGoogleMapsUrl(address: string, name: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /Users/john/work/john/DaNang-2026/website
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/tailwind.config.ts website/app/globals.css website/types/index.ts website/utils/googleMaps.ts
git commit -m "feat: add Tailwind theme, TypeScript types, and Maps utility"
```

---

## Task 3: NavBar + Layout + Footer

**Files:**
- Create: `website/app/components/NavBar.tsx`
- Create: `website/app/layout.tsx`

- [ ] **Step 1: Create `website/app/components/NavBar.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '行程表' },
  { href: '/food', label: '美食指南' },
  { href: '/spa', label: 'Spa 指南' },
  { href: '/map', label: '地圖總覽' },
  { href: '/tips', label: '注意事項' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-danang-deep text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 flex-shrink-0">
            <span>🌊</span>
            <span>峴港之旅 2026</span>
          </Link>
          <div className="flex gap-4 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium whitespace-nowrap transition-colors ${
                  pathname === link.href
                    ? 'text-danang-sand font-bold underline'
                    : 'opacity-80 hover:text-danang-sand'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `website/app/layout.tsx`**

Note: Do NOT use `next/font/google` — it requires internet access at build time and is not used in the reference Fukuoka app. Use a system font stack via Tailwind instead.

```tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "峴港之旅 2026 | Da Nang Trip 2026",
  description: "峴港旅遊行程規劃 - 2026年3月25日-28日",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-danang-cream font-sans">
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-danang-deep text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-danang-sand font-semibold mb-2">
              峴港之旅 2026年3月25日 - 3月28日
            </p>
            <p className="text-sm opacity-80">
              住宿：Seashore Hotel &amp; Apartment (3/25) · Mercure Da Nang (3/26–27) 🏨
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create a minimal placeholder home page to allow the build to run**

Create `website/app/page.tsx` with:

```tsx
export default function Home() {
  return <div className="container mx-auto p-8"><p>Coming soon...</p></div>;
}
```

- [ ] **Step 4: Run dev server and verify nav renders**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run dev
```

Open `http://localhost:3000`. Expected: ocean-blue nav bar with "🌊 峴港之旅 2026" title and 5 nav links, cream background, dark blue footer.

Stop the server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/app/components/NavBar.tsx website/app/layout.tsx website/app/page.tsx
git commit -m "feat: add NavBar, root layout, and footer"
```

---

## Task 4: Countdown Component

**Files:**
- Create: `website/app/components/Countdown.tsx`

- [ ] **Step 1: Create `website/app/components/Countdown.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';

const TRIP_START = new Date('2026-03-25');
const TRIP_END = new Date('2026-03-28');

export default function Countdown() {
  const [badge, setBadge] = useState<{ text: string; color: string } | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tripStart = new Date(TRIP_START);
    tripStart.setHours(0, 0, 0, 0);

    const tripEnd = new Date(TRIP_END);
    tripEnd.setHours(0, 0, 0, 0);

    const daysUntil = Math.ceil((tripStart.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntil > 0) {
      setBadge({ text: `⏰ 還有 ${daysUntil} 天！`, color: 'bg-danang-sand' });
    } else if (daysUntil === 0) {
      setBadge({ text: '🎉 今天出發！', color: 'bg-danang-sky' });
    } else if (today <= tripEnd) {
      setBadge({ text: '🌊 旅程進行中！', color: 'bg-danang-deep' });
    } else {
      setBadge({ text: '感謝旅程的美好回憶 🌊', color: 'bg-danang-deep' });
    }
  }, []);

  if (!badge) return null;

  return (
    <div className={`inline-block ${badge.color} text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg`}>
      {badge.text}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/john/work/john/DaNang-2026/website
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/app/components/Countdown.tsx
git commit -m "feat: add Countdown client component with live browser date"
```

---

## Task 5: Itinerary Data + Page

**Files:**
- Create: `website/data/itinerary.json`
- Modify: `website/app/page.tsx`

- [ ] **Step 1: Create `website/data/itinerary.json`**

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
        "details": "搭 Grab 至酒店，約 80,000–120,000 VND ($3–5)。建議在機場購買 Viettel 或 Mobifone SIM 卡，約 100,000 VND。",
        "icon": "✈️"
      },
      {
        "time": "下午",
        "activity": "入住 Seashore Hotel & Apartment",
        "details": "放下行李，換上輕便衣物準備探索。",
        "icon": "🏨"
      },
      {
        "time": "傍晚",
        "activity": "美溪海灘 (Mỹ Khê Beach)",
        "details": "峴港最著名的城市海灘。三月天氣 25–29°C，非常適合游泳或沿海濱步道漫步。",
        "icon": "🏖️",
        "address": "Mỹ Khê Beach, Đà Nẵng"
      },
      {
        "time": "晚餐",
        "activity": "Bánh Xèo Bà Dưỡng",
        "details": "峴港最著名的越南煎餅 (bánh xèo) 與烤豬肉串 (nem lụi)。預算約 60,000–80,000 VND。",
        "icon": "🥞",
        "address": "K280/23 Hoàng Diệu, Đà Nẵng",
        "mustTry": true
      },
      {
        "time": "晚上",
        "activity": "韓江河畔 & 龍橋 (Dragon Bridge)",
        "details": "沿韓江散步前往龍橋。週末晚上 9 點龍橋會噴火噴水，平日也有漂亮燈光。河畔很熱鬧。",
        "icon": "🐉",
        "address": "Dragon Bridge, Đà Nẵng"
      },
      {
        "time": "宵夜",
        "activity": "山茶夜市 (Son Tra Night Market)",
        "details": "如果還餓，可去山茶夜市嚐烤海鮮和烤魷魚。",
        "icon": "🦑",
        "address": "Son Tra Night Market, Đà Nẵng"
      }
    ]
  },
  {
    "id": 2,
    "date": "2026-03-26",
    "day": "第二天",
    "weekday": "星期四",
    "title": "巴拿山 & 金橋",
    "items": [
      {
        "time": "07:00",
        "activity": "早起出發巴拿山 (Bà Nà Hills)",
        "details": "盡早出發避開人群。搭 Grab 前往約 250,000–300,000 VND ($10–12)，或請酒店安排接送，車程約 45 分鐘。",
        "icon": "🚗",
        "warning": "建議提早出發，人多時纜車排隊很長"
      },
      {
        "time": "08:00",
        "activity": "巴拿山門票購買",
        "details": "成人票約 750,000 VND (~$30)，包含纜車及所有園區設施。**強烈建議提前在 booking.sunworld.vn 購票**以免排隊。",
        "icon": "🎟️",
        "mustTry": true
      },
      {
        "time": "08:30",
        "activity": "金橋 (Golden Bridge / Cầu Vàng)",
        "details": "被巨型石手托起的金色玻璃橋，是越南最著名的打卡景點。早到人少，拍照不用擠。",
        "icon": "🌉",
        "address": "Bà Nà Hills, Đà Nẵng",
        "mustTry": true
      },
      {
        "time": "上午",
        "activity": "法國村 (French Village)",
        "details": "歐式風格小鎮建築，在山頂涼爽空氣中漫步，喝杯咖啡。山頂氣溫比山下低很多，建議帶薄外套。",
        "icon": "🏰",
        "address": "French Village, Bà Nà Hills"
      },
      {
        "time": "上午",
        "activity": "夢幻樂園 (Fantasy Park)",
        "details": "包含在門票內的室內遊樂園，有各種遊樂設施。",
        "icon": "🎢"
      },
      {
        "time": "午餐",
        "activity": "巴拿山園區餐廳",
        "details": "園區內自助餐廳約 200,000–300,000 VND，或在各攤位選輕食。",
        "icon": "🍽️"
      },
      {
        "time": "15:00",
        "activity": "返回峴港，入住 Mercure Da Nang",
        "details": "下午返回市區，辦理入住 Mercure Da Nang。",
        "icon": "🏨",
        "address": "Mercure Da Nang, 36 Bạch Đằng, Đà Nẵng"
      },
      {
        "time": "晚餐",
        "activity": "Bé Anh Seafood (小英海鮮)",
        "details": "共享桌式海鮮餐廳，自選新鮮海鮮。獨旅友善、氣氛熱鬧。預算約 200,000–400,000 VND。",
        "icon": "🦐",
        "address": "Bé Anh Seafood, Đà Nẵng",
        "mustTry": true
      }
    ]
  },
  {
    "id": 3,
    "date": "2026-03-27",
    "day": "第三天",
    "weekday": "星期五",
    "title": "會安古城日遊",
    "items": [
      {
        "time": "08:30",
        "activity": "前往會安 (Hội An)",
        "details": "搭 Grab 約 200,000–250,000 VND（30–40 分鐘），或搭 Hoi An Express 穿梭巴士約 100,000 VND。",
        "icon": "🚌"
      },
      {
        "time": "09:00",
        "activity": "購買古城門票",
        "details": "120,000 VND，可參觀 5 個文化遺址，包含日本橋、福建會館、陳家祠堂等。",
        "icon": "🎟️"
      },
      {
        "time": "上午",
        "activity": "探索古城 (Old Town)",
        "details": "漫步 UNESCO 世界遺產古城黃牆小巷。必看：福建會館、近義老舖 (Tan Ky Old House)、日本橋。",
        "icon": "🏮",
        "address": "Hội An Ancient Town, Quảng Nam",
        "mustTry": true
      },
      {
        "time": "午餐",
        "activity": "中央市場 (Central Market)",
        "details": "在市場攤位品嚐會安名物：高樓麵 (cao lầu) 和越南法包 (bánh mì)。會安的 bánh mì 被公認為越南最好吃。",
        "icon": "🥖",
        "address": "Chợ Hội An, Hội An",
        "mustTry": true
      },
      {
        "time": "下午",
        "activity": "可選：竹籃船 (Basket Boat Ride)",
        "details": "在金鑾椰林水道 (Cam Thanh) 乘坐竹籃船，體驗越南漁村文化，約 200,000–300,000 VND。",
        "icon": "🛶",
        "address": "Cam Thanh Coconut Village, Hội An"
      },
      {
        "time": "傍晚",
        "activity": "燈籠夜景 & 秋盆河",
        "details": "天黑後留下——點燈後的會安最美。沿秋盆河 (Thu Bồn River) 漫步，在水面放燈籠（約 20,000 VND）。",
        "icon": "🏮",
        "mustTry": true
      },
      {
        "time": "夜晚",
        "activity": "會安夜市",
        "details": "逛夜市，買紀念品、客製化衣服（會安裁縫聞名），嚐街頭小食。",
        "icon": "🌙",
        "address": "Hội An Night Market"
      },
      {
        "time": "晚上",
        "activity": "返回峴港",
        "details": "搭 Grab 或穿梭巴士返回峴港 Mercure，車程約 30–40 分鐘。",
        "icon": "🚗"
      }
    ]
  },
  {
    "id": 4,
    "date": "2026-03-28",
    "day": "第四天",
    "weekday": "星期六",
    "title": "大理石山 & 啟程",
    "items": [
      {
        "time": "07:00",
        "activity": "退房 Mercure Da Nang",
        "details": "整理行李，辦理退房，行李可寄存在前台。",
        "icon": "🧳"
      },
      {
        "time": "07:30",
        "activity": "大理石山 (Marble Mountains / Ngũ Hành Sơn)",
        "details": "市區南方約 8 公里，Grab 約 50,000 VND。入場 40,000 VND + 電梯 15,000 VND（建議搭電梯上、走樓梯下）。從 2 號門入場較方便。",
        "icon": "⛰️",
        "address": "Ngũ Hành Sơn, Đà Nẵng",
        "mustTry": true
      },
      {
        "time": "上午",
        "activity": "玄空洞 (Huyền Không Cave)",
        "details": "大理石山內最壯觀的洞穴，天光穿過崩塌的洞頂照入，拍照絕美。預留 1.5–2 小時遊覽，穿舒適鞋、帶水。",
        "icon": "🕌",
        "address": "Huyền Không Cave, Marble Mountains, Đà Nẵng",
        "mustTry": true
      },
      {
        "time": "10:00",
        "activity": "前往峴港國際機場",
        "details": "機場距市區大多景點 15–20 分鐘車程。預留充裕時間。",
        "icon": "✈️",
        "address": "Da Nang International Airport (DAD)"
      }
    ]
  }
]
```

- [ ] **Step 2: Replace `website/app/page.tsx` with the full itinerary page**

```tsx
import itineraryData from '@/data/itinerary.json';
import type { DayItinerary } from '@/types';
import { getGoogleMapsUrl } from '@/utils/googleMaps';
import Countdown from './components/Countdown';

const dayEmojis: Record<number, string> = {
  1: '✈️',
  2: '🚡',
  3: '🏮',
  4: '⛰️',
};

export default function Home() {
  const itinerary = itineraryData as DayItinerary[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-danang-deep mb-4">
          峴港之旅行程表 🌊
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          2026年3月25日 (三) — 3月28日 (六)
        </p>
        <Countdown />
      </div>

      {/* Day Cards */}
      <div className="max-w-4xl mx-auto space-y-8">
        {itinerary.map((day) => (
          <div
            key={day.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-l-4 border-danang-sky"
          >
            {/* Day Header */}
            <div className="p-6" style={{ background: 'linear-gradient(to right, #0077B6, #00B4D8)' }}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {day.day} — {day.title}
                  </h2>
                  <p className="text-white opacity-90">
                    {day.date} ({day.weekday})
                  </p>
                </div>
                <div className="text-5xl">{dayEmojis[day.id]}</div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-6">
              <div className="space-y-4">
                {day.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-4 hover:bg-danang-cream rounded-lg transition-colors"
                  >
                    {item.icon && (
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="inline-block bg-danang-deep text-white px-3 py-1 rounded-full text-sm font-medium">
                          {item.time}
                        </span>
                        <h3 className="font-bold text-lg text-danang-deep">
                          {item.activity}
                        </h3>
                        {item.mustTry && (
                          <span className="inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            必試
                          </span>
                        )}
                        {item.warning && (
                          <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            ⚠️ {item.warning}
                          </span>
                        )}
                      </div>

                      {item.details && (
                        <p className="text-gray-700 mt-1">{item.details}</p>
                      )}

                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {item.hours && (
                          <p className="flex items-center gap-2">
                            <span>🕒</span>
                            <span>{item.hours}</span>
                          </p>
                        )}
                        {item.address && (
                          <p className="flex items-start gap-2">
                            <span>📍</span>
                            <a
                              href={getGoogleMapsUrl(item.address, item.activity)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-danang-deep hover:underline"
                            >
                              {item.address}
                            </a>
                          </p>
                        )}
                      </div>

                      {item.backup && (
                        <div className="mt-3 bg-gray-100 p-2 rounded border-l-2 border-gray-400 text-sm text-gray-700">
                          <span className="font-bold mr-1">🛡️ 備案:</span>
                          {item.backup}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run build to verify**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run build
```

Expected: build succeeds, `out/` directory created with `index.html`.

- [ ] **Step 4: Spot-check in dev**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify: 4 day cards render with correct content, countdown badge appears, addresses are linked, mustTry badge shows in red. Stop server.

- [ ] **Step 5: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/data/itinerary.json website/app/page.tsx
git commit -m "feat: add itinerary data and home page"
```

---

## Task 6: Food Guide Data + Page

**Files:**
- Create: `website/data/food.json`
- Create: `website/app/food/page.tsx`

- [ ] **Step 1: Create `website/data/food.json`**

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
    "priceRange": "60,000–80,000 VND (~$3)",
    "details": "峴港最著名的越南煎餅 (bánh xèo) 專賣店。外皮酥脆，搭配新鮮蔬菜和烤豬肉串 (nem lụi)。是峴港必吃的在地美食。",
    "icon": "🥞"
  },
  {
    "id": "be-anh-seafood",
    "name": "Bé Anh Seafood",
    "chineseName": "小英海鮮",
    "category": "海鮮",
    "mustEat": true,
    "day": "第二天",
    "address": "Bé Anh Seafood, Đà Nẵng",
    "hours": "10:00–22:00",
    "priceRange": "200,000–400,000 VND ($8–16)",
    "details": "共享桌式海鮮餐廳，自選新鮮海鮮秤重計費。氣氛熱鬧，獨旅者也很友善。常見選擇：烤扇貝、炒蛤蜊、烤蝦。",
    "icon": "🦐"
  },
  {
    "id": "cao-lau-hoi-an",
    "name": "Cao Lầu",
    "chineseName": "高樓麵",
    "category": "麵食",
    "mustEat": true,
    "day": "第三天 (會安)",
    "address": "Chợ Hội An, Hội An",
    "priceRange": "30,000–50,000 VND (~$2)",
    "details": "會安獨有的厚切麵條料理，搭配叉燒肉片、脆麵、新鮮蔬菜和醬汁。傳統上只用會安井水製麵，全越南只有會安才有正宗口味。在中央市場攤位享用最在地。",
    "icon": "🍜"
  },
  {
    "id": "banh-mi-hoi-an",
    "name": "Bánh Mì Phượng",
    "chineseName": "鳳凰越南法包",
    "category": "麵包",
    "mustEat": true,
    "day": "第三天 (會安)",
    "address": "2B Phan Châu Trinh, Hội An",
    "hours": "06:30–21:30",
    "priceRange": "25,000–35,000 VND (~$1.5)",
    "details": "被《安東尼·波登：沒有訂位》節目介紹的傳奇法包店。會安法包公認越南最好吃——外皮脆、內料豐富，有豬肉、肝醬、蔬菜等多種選擇。",
    "icon": "🥖",
    "notes": "人氣極高，可能需要等候。值得！"
  },
  {
    "id": "son-tra-night-market",
    "name": "Chợ Đêm Sơn Trà",
    "chineseName": "山茶夜市",
    "category": "夜市",
    "day": "第一天",
    "address": "Son Tra Night Market, Đà Nẵng",
    "hours": "18:00–23:00",
    "priceRange": "50,000–150,000 VND",
    "details": "峴港著名夜市，主打烤海鮮攤位。烤魷魚、烤蝦、烤扇貝都很推薦。還有各種小食和飲料。適合第一天到達後宵夜閒逛。",
    "icon": "🦑"
  },
  {
    "id": "mi-quang",
    "name": "Mì Quảng",
    "chineseName": "廣南麵",
    "category": "麵食",
    "mustEat": true,
    "address": "Đà Nẵng",
    "priceRange": "40,000–60,000 VND (~$2.5)",
    "details": "廣南省的代表性料理，也是峴港的在地美食。寬扁黃麵配薑黃湯底，加豬肉、蝦、花生、脆麵、新鮮香草。湯汁不多，拌著吃。任何一家在地小麵店都可嚐到。",
    "icon": "🍜"
  },
  {
    "id": "banh-trang-tron",
    "name": "Bánh Tráng Trộn",
    "chineseName": "越南米紙沙拉",
    "category": "街頭小食",
    "address": "Đà Nẵng",
    "priceRange": "15,000–25,000 VND (~$1)",
    "details": "超受學生和年輕人歡迎的街頭小食。脆米紙條拌上青芒果絲、蝦乾、花生、辣椒、越南香草，口感豐富有趣。在夜市攤位或路邊攤找。",
    "icon": "🌮"
  },
  {
    "id": "ca-phe-trung",
    "name": "Cà Phê Trứng",
    "chineseName": "雞蛋咖啡",
    "category": "咖啡",
    "address": "Đà Nẵng",
    "priceRange": "30,000–50,000 VND (~$2)",
    "details": "越南獨特的「蛋咖啡」，以蛋黃、煉乳、咖啡打成綿密泡沫覆蓋在濃縮咖啡上，口感像提拉米蘇。是越南咖啡文化的代表之一。峴港各咖啡館都有供應。",
    "icon": "☕"
  }
]
```

- [ ] **Step 2: Create `website/app/food/page.tsx`**

```tsx
import foodData from '@/data/food.json';
import type { FoodEntry } from '@/types';
import { getGoogleMapsUrl } from '@/utils/googleMaps';

// Placeholder My Maps embed URL — replace with real URL after creating Google My Maps
const FOOD_MAP_URL = 'https://www.google.com/maps/d/embed?mid=REPLACE_WITH_REAL_MID';

export default function FoodPage() {
  const foods = foodData as FoodEntry[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-danang-deep mb-4">
          峴港美食指南 🍜
        </h1>
        <p className="text-xl text-gray-700">必吃美食 &amp; 在地推薦</p>
      </div>

      {/* Food Cards */}
      <div className="max-w-4xl mx-auto space-y-6 mb-12">
        {foods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-l-4 border-danang-sky p-6"
          >
            <div className="flex gap-4 items-start">
              {food.icon && (
                <div className="text-4xl flex-shrink-0">{food.icon}</div>
              )}
              <div className="flex-1">
                {/* Name + tags */}
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-danang-deep">{food.name}</h2>
                    <p className="text-gray-600 text-sm">{food.chineseName}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {food.mustEat && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">必吃</span>
                    )}
                    {food.day && (
                      <span className="bg-danang-sky text-white px-2 py-1 rounded text-xs font-bold">{food.day}</span>
                    )}
                    <span className="bg-danang-light text-danang-deep px-2 py-1 rounded text-xs font-bold">{food.category}</span>
                  </div>
                </div>

                {/* Details */}
                <p className="text-gray-700 mb-3">{food.details}</p>

                {/* Meta info */}
                <div className="space-y-1 text-sm text-gray-600">
                  {food.hours && (
                    <p className="flex items-center gap-2">
                      <span>🕒</span><span>{food.hours}</span>
                    </p>
                  )}
                  {food.priceRange && (
                    <p className="flex items-center gap-2">
                      <span>💰</span><span>{food.priceRange}</span>
                    </p>
                  )}
                  <p className="flex items-start gap-2">
                    <span>📍</span>
                    <a
                      href={getGoogleMapsUrl(food.address, food.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-danang-deep hover:underline"
                    >
                      {food.address}
                    </a>
                  </p>
                </div>

                {food.notes && (
                  <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-sm text-yellow-800">
                    💡 {food.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Map */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-danang-deep mb-4">🗺️ 美食地圖</h2>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={FOOD_MAP_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="峴港美食地圖"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          點擊地圖標記查看詳情。
          <a
            href={FOOD_MAP_URL.replace('/embed', '/viewer')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-danang-sky hover:underline ml-1"
          >
            在 Google Maps 中開啟 →
          </a>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run build
```

Expected: build succeeds. `out/food/index.html` created.

- [ ] **Step 4: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/data/food.json website/app/food/page.tsx
git commit -m "feat: add food guide data and page"
```

---

## Task 7: Spa Guide Data + Page

**Files:**
- Create: `website/data/spa.json`
- Create: `website/app/spa/page.tsx`

- [ ] **Step 1: Create `website/data/spa.json`**

```json
[
  {
    "id": "palmarosa-spa",
    "name": "Palmarosa Spa",
    "services": ["越式按摩", "精油按摩", "臉部護理", "身體磨砂"],
    "priceRange": "$15–35 USD",
    "duration": "60–90 分鐘",
    "address": "64 Nguyễn Thị Minh Khai, Đà Nẵng",
    "bookingNote": "建議提前預約，尤其週末人多",
    "backup": "Herbal Spa Da Nang"
  },
  {
    "id": "herbal-spa",
    "name": "Herbal Spa Da Nang",
    "services": ["越式按摩", "草本熱敷", "足底按摩", "精油按摩"],
    "priceRange": "$12–28 USD",
    "duration": "60–120 分鐘",
    "address": "15 Hoàng Diệu, Đà Nẵng",
    "bookingNote": "接受現場預約，環境整潔舒適"
  },
  {
    "id": "white-lotus-spa",
    "name": "White Lotus Spa",
    "services": ["越式傳統按摩", "四手按摩", "熱石按摩", "芳療"],
    "priceRange": "$20–50 USD",
    "duration": "60–120 分鐘",
    "address": "White Lotus Spa, Đà Nẵng",
    "bookingNote": "環境優雅，適合放鬆型體驗",
    "backup": "Palmarosa Spa"
  },
  {
    "id": "my-khe-beach-massage",
    "name": "美溪海灘按摩 (Mỹ Khê Beach Massage)",
    "services": ["背部按摩", "全身按摩", "足底按摩"],
    "priceRange": "100,000–200,000 VND ($4–8)",
    "duration": "30–60 分鐘",
    "address": "Mỹ Khê Beach, Đà Nẵng",
    "bookingNote": "海灘沿線有多家店，價格實惠，現場即可，無需預約。適合海灘活動後放鬆。"
  }
]
```

- [ ] **Step 2: Create `website/app/spa/page.tsx`**

```tsx
import spaData from '@/data/spa.json';
import type { SpaEntry } from '@/types';
import { getGoogleMapsUrl } from '@/utils/googleMaps';

// Placeholder My Maps embed URL — replace with real URL after creating Google My Maps
const SPA_MAP_URL = 'https://www.google.com/maps/d/embed?mid=REPLACE_WITH_REAL_MID';

export default function SpaPage() {
  const spas = spaData as SpaEntry[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-danang-deep mb-4">
          Spa &amp; 按摩指南 💆
        </h1>
        <p className="text-xl text-gray-700">精選放鬆體驗</p>
      </div>

      {/* Spa Cards */}
      <div className="max-w-4xl mx-auto space-y-6 mb-12">
        {spas.map((spa) => (
          <div
            key={spa.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-l-4 border-danang-sky p-6"
          >
            <div className="mb-3">
              <h2 className="text-xl font-bold text-danang-deep mb-1">{spa.name}</h2>
              <div className="flex gap-2 flex-wrap mb-3">
                {spa.services.map((s) => (
                  <span key={s} className="bg-danang-light text-danang-deep px-2 py-1 rounded text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span>💰</span><span>{spa.priceRange}</span>
              </p>
              <p className="flex items-center gap-2">
                <span>⏱️</span><span>{spa.duration}</span>
              </p>
              <p className="flex items-start gap-2">
                <span>📍</span>
                <a
                  href={getGoogleMapsUrl(spa.address, spa.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-danang-deep hover:underline"
                >
                  {spa.address}
                </a>
              </p>
            </div>

            {spa.bookingNote && (
              <div className="mt-3 bg-blue-50 border-l-4 border-danang-sky p-2 rounded text-sm text-danang-deep">
                📋 {spa.bookingNote}
              </div>
            )}

            {spa.backup && (
              <div className="mt-3 bg-gray-100 p-2 rounded border-l-2 border-gray-400 text-sm text-gray-700">
                <span className="font-bold mr-1">🛡️ 備選：</span>{spa.backup}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Embedded Map */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-danang-deep mb-4">🗺️ Spa 地圖</h2>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={SPA_MAP_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="峴港 Spa 地圖"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          點擊地圖標記查看詳情。
          <a
            href={SPA_MAP_URL.replace('/embed', '/viewer')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-danang-sky hover:underline ml-1"
          >
            在 Google Maps 中開啟 →
          </a>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run build
```

Expected: build succeeds. `out/spa/index.html` created.

- [ ] **Step 4: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/data/spa.json website/app/spa/page.tsx
git commit -m "feat: add spa guide data and page"
```

---

## Task 8: Map Overview Page

**Files:**
- Create: `website/app/components/MapFilters.tsx`
- Create: `website/app/map/page.tsx`

- [ ] **Step 1: Create `website/app/components/MapFilters.tsx`**

This client component renders category filter buttons that scroll to the matching section in the list below the map.

```tsx
'use client';

const categories = [
  { label: '全部', id: 'all' },
  { label: '行程景點', id: 'attractions' },
  { label: '美食', id: 'food' },
  { label: 'Spa', id: 'spa' },
];

export default function MapFilters() {
  const scrollTo = (id: string) => {
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => scrollTo(cat.id)}
          className="bg-danang-deep text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-danang-sky transition-colors"
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `website/app/map/page.tsx`**

```tsx
import itineraryData from '@/data/itinerary.json';
import foodData from '@/data/food.json';
import spaData from '@/data/spa.json';
import type { DayItinerary, FoodEntry, SpaEntry } from '@/types';
import { getGoogleMapsUrl } from '@/utils/googleMaps';
import MapFilters from '../components/MapFilters';

// Placeholder My Maps embed URL — replace with real URL after creating Google My Maps
const ALL_MAP_URL = 'https://www.google.com/maps/d/embed?mid=REPLACE_WITH_REAL_MID';

export default function MapPage() {
  const itinerary = itineraryData as DayItinerary[];
  const foods = foodData as FoodEntry[];
  const spas = spaData as SpaEntry[];

  // Flatten all itinerary locations
  const attractions = itinerary.flatMap((day) =>
    day.items
      .filter((item) => item.address)
      .map((item) => ({ name: item.activity, address: item.address!, day: day.day }))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-danang-deep mb-4">
          所有地點總覽 🗺️
        </h1>
        <p className="text-xl text-gray-700">峴港旅程所有地點一次看清</p>
      </div>

      {/* Filter buttons */}
      <div className="max-w-5xl mx-auto">
        <MapFilters />

        {/* Large embedded map */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-4">
          <iframe
            src={ALL_MAP_URL}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="峴港所有地點地圖"
          />
        </div>
        <p className="text-sm text-gray-500 mb-10 text-center">
          🔵 行程景點 &nbsp;🟠 美食 &nbsp;🟢 Spa &nbsp;·&nbsp;
          <a
            href={ALL_MAP_URL.replace('/embed', '/viewer')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-danang-sky hover:underline"
          >
            在 Google Maps 中開啟 →
          </a>
        </p>

        {/* Location list — Attractions */}
        <div id="section-attractions" className="mb-10">
          <h2 className="text-2xl font-bold text-danang-deep mb-4">🗓️ 行程景點</h2>
          <div className="space-y-2">
            {attractions.map((a, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs text-danang-sky font-medium mr-2">{a.day}</span>
                  <span className="font-medium text-gray-800">{a.name}</span>
                </div>
                <a
                  href={getGoogleMapsUrl(a.address, a.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-danang-sky hover:underline flex-shrink-0 ml-4"
                >
                  📍 地圖
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Location list — Food */}
        <div id="section-food" className="mb-10">
          <h2 className="text-2xl font-bold text-danang-deep mb-4">🍜 美食</h2>
          <div className="space-y-2">
            {foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <span className="font-medium text-gray-800">{food.icon} {food.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{food.chineseName}</span>
                  {food.mustEat && (
                    <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">必吃</span>
                  )}
                </div>
                <a
                  href={getGoogleMapsUrl(food.address, food.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-danang-sky hover:underline flex-shrink-0 ml-4"
                >
                  📍 地圖
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Location list — Spa */}
        <div id="section-spa" className="mb-10">
          <h2 className="text-2xl font-bold text-danang-deep mb-4">💆 Spa</h2>
          <div className="space-y-2">
            {spas.map((spa) => (
              <div key={spa.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-800">{spa.name}</span>
                <a
                  href={getGoogleMapsUrl(spa.address, spa.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-danang-sky hover:underline flex-shrink-0 ml-4"
                >
                  📍 地圖
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run build
```

Expected: build succeeds. `out/map/index.html` created.

- [ ] **Step 4: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/app/components/MapFilters.tsx website/app/map/page.tsx
git commit -m "feat: add map overview page with category filter buttons"
```

---

## Task 9: Tips Data + Page

**Files:**
- Create: `website/data/tips.json`
- Create: `website/app/tips/page.tsx`

- [ ] **Step 1: Create `website/data/tips.json`**

```json
{
  "warnings": [
    {
      "title": "重要提醒",
      "icon": "⚠️",
      "items": [
        "巴拿山門票請提前在 booking.sunworld.vn 購買，成人 750,000 VND，可免排隊",
        "會安古城門票 120,000 VND，包含 5 個文化景點入場",
        "第二天請 7:00 出發前往巴拿山，避開旅行團人潮",
        "大理石山第四天安排在出發前早上，預留充裕機場時間"
      ]
    },
    {
      "title": "交通提醒",
      "icon": "🚗",
      "items": [
        "全程使用 Grab 叫車，安全可靠且費用透明，無語言障礙",
        "巴拿山來回可請酒店安排接送或搭 Grab，單程約 250,000–300,000 VND",
        "機場至市區約 15–20 分鐘，Grab 約 80,000–120,000 VND"
      ]
    }
  ],
  "packingList": [
    "輕便透氣衣物（3月天氣 25–29°C，溫暖潮濕）",
    "薄外套或連帽衫（巴拿山山頂較涼，室內冷氣強）",
    "舒適步行鞋（大理石山石階、會安石板路）",
    "防曬乳、太陽眼鏡、帽子",
    "泳衣（美溪海灘）",
    "小型日用背包",
    "雨傘或輕便雨衣（備用，3月偶有陣雨）"
  ],
  "apps": [
    { "name": "Grab", "description": "叫車首選，支援信用卡付款，無語言障礙" },
    { "name": "Google Maps", "description": "建議提前下載峴港及會安離線地圖備用" },
    { "name": "Google Translate", "description": "相機翻譯功能對看越文菜單非常實用" }
  ],
  "transport": [
    "機場至海灘區 Grab：約 80,000–120,000 VND ($3–5)",
    "峴港市區短途 Grab：約 30,000–60,000 VND",
    "峴港至巴拿山 Grab（單程）：約 250,000–300,000 VND ($10–12)",
    "峴港至會安 Grab：約 200,000–250,000 VND ($8–10)",
    "峴港至大理石山 Grab：約 50,000 VND"
  ],
  "budget": [
    { "category": "餐飲", "dailyEstimate": "$15–25" },
    { "category": "交通 (Grab)", "dailyEstimate": "$10–15" },
    { "category": "活動 & 門票", "dailyEstimate": "$15–35" },
    { "category": "每日合計", "dailyEstimate": "~$40–75" }
  ],
  "accommodation": [
    { "date": "3月25日 (三)", "hotel": "Seashore Hotel & Apartment" },
    { "date": "3月26–27日 (四–五)", "hotel": "Mercure Da Nang（已確認）" }
  ]
}
```

- [ ] **Step 2: Create `website/app/tips/page.tsx`**

```tsx
import tipsData from '@/data/tips.json';
import type { TipsData } from '@/types';

export default function TipsPage() {
  const tips = tipsData as TipsData;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-danang-deep mb-4">
          注意事項 & 實用資訊 📋
        </h1>
        <p className="text-xl text-gray-700">出發前必讀</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Warnings */}
        {tips.warnings.map((section, idx) => (
          <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              {section.icon} {section.title}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-yellow-900">
                  <span className="flex-shrink-0">🔸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Accommodation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-danang-deep mb-4">🏨 住宿資訊</h2>
          <div className="space-y-3">
            {tips.accommodation.map((a, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-danang-cream rounded-lg">
                <span className="font-medium text-danang-deep">{a.date}</span>
                <span className="text-gray-700">{a.hotel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-danang-deep mb-4">💰 每日預算估算（不含機票住宿）</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-danang-deep text-white">
                  <th className="text-left p-3 rounded-tl-lg">類別</th>
                  <th className="text-right p-3 rounded-tr-lg">每日估算</th>
                </tr>
              </thead>
              <tbody>
                {tips.budget.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-danang-cream' : 'bg-white'}>
                    <td className="p-3 font-medium">{row.category}</td>
                    <td className="p-3 text-right">{row.dailyEstimate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">第二天（巴拿山）費用最高，約 $45 門票+交通。</p>
        </div>

        {/* Transport */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-danang-deep mb-4">🚗 交通費用參考</h2>
          <ul className="space-y-2">
            {tips.transport.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="flex-shrink-0 text-danang-sky">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Packing */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-danang-deep mb-4">🎒 打包清單（3月份峴港）</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tips.packingList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="flex-shrink-0">✅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-danang-deep mb-4">📱 實用 App</h2>
          <div className="space-y-3">
            {tips.apps.map((app, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-danang-cream rounded-lg">
                <div className="flex-1">
                  <span className="font-bold text-danang-deep">{app.name}</span>
                  <span className="text-gray-600 ml-2 text-sm">— {app.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/john/work/john/DaNang-2026/website
npm run build
```

Expected: build succeeds. `out/tips/index.html` created.

- [ ] **Step 4: Commit**

```bash
cd /Users/john/work/john/DaNang-2026
git add website/data/tips.json website/app/tips/page.tsx
git commit -m "feat: add tips data and notes page"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full clean build**

```bash
cd /Users/john/work/john/DaNang-2026/website
rm -rf .next out
npm run build
```

Expected: clean build with no errors or warnings. `out/` contains: `index.html`, `food/index.html`, `spa/index.html`, `map/index.html`, `tips/index.html`.

- [ ] **Step 2: Verify all pages in dev**

```bash
npm run dev
```

Check each page:
- `http://localhost:3000` — 4 day cards, countdown badge, mustTry badges, address links
- `http://localhost:3000/food` — 8 food cards, tags, map placeholder iframe
- `http://localhost:3000/spa` — 4 spa cards, service tags, backup notices
- `http://localhost:3000/map` — filter buttons scroll to sections, all 3 location lists, map iframe
- `http://localhost:3000/tips` — warnings, accommodation, budget table, transport, packing, apps
- Nav active link highlights correctly on each page
- Footer shows on all pages
- Mobile: resize browser to 375px wide — nav scrolls horizontally, single-column layout

Stop server.

- [ ] **Step 3: Add `.superpowers/` to .gitignore**

Open `website/.gitignore` and check it's in the root `.gitignore`. Also add to the project root:

```bash
echo ".superpowers/" >> /Users/john/work/john/DaNang-2026/.gitignore
```

- [ ] **Step 4: Commit final state**

```bash
cd /Users/john/work/john/DaNang-2026
git add -A
git commit -m "feat: complete Da Nang 2026 web app — all 5 pages"
```

---

## Post-Build Manual Step: Create Google My Maps

Before deploying, create one Google My Maps with all locations:

1. Go to [Google My Maps](https://www.google.com/mymaps) and create a new map titled "峴港之旅 2026"
2. Add three layers: **行程景點** (blue), **美食** (orange), **Spa** (green)
3. Add all pins from `itinerary.json`, `food.json`, and `spa.json`
4. Publish the map (Share → Publish to web)
5. Get the embed URL: Share → Embed on my site → copy the `src` URL (format: `https://www.google.com/maps/d/embed?mid=XXXXXX`)
6. Replace `REPLACE_WITH_REAL_MID` in three files:
   - `website/app/food/page.tsx` (line with `FOOD_MAP_URL`)
   - `website/app/spa/page.tsx` (line with `SPA_MAP_URL`)
   - `website/app/map/page.tsx` (line with `ALL_MAP_URL`)
7. Rebuild and deploy

---

## Deployment (Vercel)

```bash
cd /Users/john/work/john/DaNang-2026/website
npx vercel --prod
```

Or connect the GitHub repo to Vercel for automatic CI/CD.
