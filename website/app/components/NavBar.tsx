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
    <nav aria-label="Main navigation" className="bg-danang-deep text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 flex-shrink-0">
            <span aria-hidden="true">🌊</span>
            <span>峴港之旅 2026</span>
          </Link>
          <div className="flex gap-4 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
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
