'use client';

import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import Footer from '@/components/Footer';
import HowItWorksModal from '@/components/HowItWorksModal';
import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = getDefaultConfig({
  appName: 'BNBMON',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  
  useEffect(() => {
    // Auto-show modal on every page load
    setShowHowItWorks(true);
  }, []);
  
  return (
    <>
      <HowItWorksModal 
        isOpen={showHowItWorks} 
        onClose={() => setShowHowItWorks(false)} 
      />
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>BNBMON - Strategic Pokemon Card Acquisition</title>
        <meta name="description" content="BNBMON - Join acquisition pools to strategically acquire Pokemon card supply through community-driven coordination" />
        <link rel="icon" href="/Arena (23).png" />
        <meta property="og:title" content="BNBMON - Strategic Pokemon Card Acquisition" />
        <meta property="og:description" content="Join acquisition pools to strategically acquire Pokemon card supply through community-driven coordination" />
        <meta property="og:image" content="/Arena (23).png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize="compact">
              <AppWrapper>
                {children}
                <Footer />
              </AppWrapper>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
