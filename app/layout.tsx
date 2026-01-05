'use client';

import "./globals.css";
import Footer from '@/components/Footer';
import HowItWorksModal from '@/components/HowItWorksModal';
import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <title>Bonk Reserve - Strategic Pokemon Card Acquisition</title>
        <meta name="description" content="Bonk Reserve - Join acquisition pools to strategically acquire Pokemon card supply through community-driven coordination" />
        <link rel="icon" href="/Arena (23).png" />
        <meta property="og:title" content="Bonk Reserve - Strategic Pokemon Card Acquisition" />
        <meta property="og:description" content="Join acquisition pools to strategically acquire Pokemon card supply through community-driven coordination" />
        <meta property="og:image" content="/Arena (23).png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          {children}
          <Footer />
        </AppWrapper>
      </body>
    </html>
  );
}
