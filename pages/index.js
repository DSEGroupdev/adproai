// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
import Head from 'next/head'
import { FiZap, FiTarget, FiLayers, FiTrendingUp, FiCheck, FiArrowRight, FiChevronDown, FiCopy } from 'react-icons/fi';
import Image from 'next/image';
import WhiteHeroTest from '../components/WhiteHeroTest';
import { useState } from 'react';

// Force Deploy - Update Form Styling
export default function Home() {
  return (
    <>
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <Image 
            src="/logo.jpg" 
            alt="Ad Pro AI Logo" 
            width={800}
            height={224}
            className="w-full max-w-md mx-auto mb-8"
            priority
          />
          <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-300">We're working on something amazing. Stay tuned!</p>
        </div>
      </div>
    </>
  );
} 