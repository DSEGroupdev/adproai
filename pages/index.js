// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>Ad Pro AI - AI-Powered Ad Copy Generation</title>
        <meta name="description" content="Generate high-converting ad copy in seconds with Ad Pro AI. Built for marketers, entrepreneurs, and agencies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-14">
              <Image
                src="/logo.jpg"
                alt="Ad Pro AI Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-[#D4AF37] tracking-wider uppercase font-medium mb-8">
              Join 100+ Marketers Using Ad Pro AI
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white leading-tight">
              Generate High-Converting<br />Ad Copy in Seconds
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Built for marketers, entrepreneurs, and agencies.<br />No writing skills needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto">
                Get Started Now
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37] w-5 h-5" />
                <span>AI-Powered Copy Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37] w-5 h-5" />
                <span>Multiple Ad Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37] w-5 h-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#111]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiCheck className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Copy</h3>
              <p className="text-gray-400">Generate compelling ad copy using advanced AI technology trained on high-performing ads.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiCheck className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multiple Formats</h3>
              <p className="text-gray-400">Create ads for Facebook, Google, LinkedIn, and more with format-specific optimization.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiCheck className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Results</h3>
              <p className="text-gray-400">Get multiple ad variations in seconds, ready to test and deploy to your campaigns.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 