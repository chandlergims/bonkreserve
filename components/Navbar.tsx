'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquaresFour, ChartBar, Info, SignOut, CaretDown, CaretUp } from 'phosphor-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { disconnect } = useDisconnect();
  
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between relative">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/Arena (23).png" 
                alt="BNBMON" 
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
          <div className="flex items-center space-x-4 justify-end">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold text-sm border-b-2 border-black cursor-pointer"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      return (
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-bold text-sm cursor-pointer"
                          >
                            <span>{shortenAddress(account.address)}</span>
                            {dropdownOpen ? (
                              <CaretUp size={16} weight="bold" />
                            ) : (
                              <CaretDown size={16} weight="bold" />
                            )}
                          </button>
                          
                          {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                              <button
                                onClick={() => {
                                  setDropdownOpen(false);
                                  disconnect();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-gray-900 font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <SignOut size={16} weight="regular" />
                                Logout
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
}
