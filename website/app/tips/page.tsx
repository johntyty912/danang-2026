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
