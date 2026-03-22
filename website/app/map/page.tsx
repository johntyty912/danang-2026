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
