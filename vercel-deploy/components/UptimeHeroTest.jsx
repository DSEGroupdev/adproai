import React from 'react';
import Image from 'next/image';

export default function UptimeHeroTest() {
  return (
    <section className="bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#D4AF37] tracking-wider uppercase font-medium mb-4">
            Join 100+ marketers using Ad Pro AI
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
            Generate High-Converting Ad Copy in Seconds
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Built for marketers, entrepreneurs, and agencies. No writing skills needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-[#D4AF37] hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto">
              Try it Free
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 