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
