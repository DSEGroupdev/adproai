import React from 'react';
import Image from 'next/image';

export default function WhiteHeroTest() {
  return (
    <section className="bg-black pt-8 pb-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gold tracking-wider uppercase font-medium mb-8">
            Join 100+ marketers using Ad Pro AI
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white leading-tight">
            Generate High-Converting Ad Copy in Seconds
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Built for marketers, entrepreneurs, and agencies. No writing skills needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <button className="bg-gold hover:bg-gold-hover text-white font-bold py-4 px-10 rounded-lg transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Try it Free
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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