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
