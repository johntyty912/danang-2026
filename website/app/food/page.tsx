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
