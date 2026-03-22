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
