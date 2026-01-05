'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquaresFour, ChartBar, Info } from 'phosphor-react';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between relative">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/Arena (23).png" 
                alt="Bonk Reserve" 
                className="h-16 sm:h-18 md:h-20 w-auto select-none"
              />
            </Link>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
            <Link
              href="/search"
              className={`font-bold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                pathname === '/search'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <SquaresFour size={20} weight={pathname === '/search' ? 'fill' : 'regular'} />
              <span className="text-sm">Discover</span>
            </Link>
            <Link
              href="/strategy"
              className={`font-bold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                pathname === '/strategy'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <ChartBar size={20} weight={pathname === '/strategy' ? 'fill' : 'regular'} />
              <span className="text-sm">Strategy</span>
            </Link>
            <Link
              href="/how-it-works"
              className={`font-bold transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg ${
                pathname === '/how-it-works'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <Info size={20} weight={pathname === '/how-it-works' ? 'fill' : 'regular'} />
              <span className="text-sm">How It Works</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
