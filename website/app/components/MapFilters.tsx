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
