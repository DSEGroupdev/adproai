// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'
import { FiZap, FiCode, FiServer, FiTarget, FiCpu, FiBox } from 'react-icons/fi'
import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    usp: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add form submission logic here
    console.log('Form submitted:', formData)
  }

  const scrollToForm = () => {
    document.getElementById('adCopyForm')?.scrollIntoView({ behavior: 'smooth' })
  }

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
            <div className="relative w-56 h-24">
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
      <section className="pt-40 pb-20 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-[#D4AF37] tracking-wider uppercase font-medium mb-8">
              Join 100+ Marketers Using Ad Pro AI
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Generate High-Converting<br />Ad Copy in Seconds
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Built for marketers, entrepreneurs, and agencies.<br />No writing skills needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={scrollToForm}
                className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Get Started Now
                <FiZap className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <FiCpu className="text-[#D4AF37] w-5 h-5" />
                <span>AI-Powered Copy Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <FiServer className="text-[#D4AF37] w-5 h-5" />
                <span>Multiple Ad Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZap className="text-[#D4AF37] w-5 h-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#111] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37] transition-colors">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiCpu className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Copy</h3>
              <p className="text-gray-400">Generate compelling ad copy using advanced AI technology trained on high-performing ads.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37] transition-colors">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiTarget className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multiple Formats</h3>
              <p className="text-gray-400">Create ads for Facebook, Google, LinkedIn, and more with format-specific optimization.</p>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37] transition-colors">
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6">
                <FiZap className="text-[#D4AF37] w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Results</h3>
              <p className="text-gray-400">Get multiple ad variations in seconds, ready to test and deploy to your campaigns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Copy Generator Form */}
      <section id="adCopyForm" className="py-20 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Generate Your Ad Copy
              </h2>
              <p className="text-gray-400">
                Fill in the details below and let our AI create compelling ad copy for your business
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-300 mb-2">
                  Product or Service Name
                </label>
                <input
                  type="text"
                  id="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Social Media Management Tool"
                />
              </div>
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Small Business Owners"
                />
              </div>
              <div>
                <label htmlFor="usp" className="block text-sm font-medium text-gray-300 mb-2">
                  Unique Selling Points
                </label>
                <textarea
                  id="usp"
                  value={formData.usp}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Save 10 hours per week, Automated posting, Analytics included"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
              >
                Generate Ad Copy
                <FiZap className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#111] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">
              Choose the plan that best fits your needs
            </p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Starter</h3>
                <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>100 Ad Copies/month</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Basic Ad Formats</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Email Support</span>
                  </li>
                </ul>
                <button className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-[#D4AF37] transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Professional</h3>
                <div className="text-4xl font-bold text-white mb-6">$79<span className="text-lg text-gray-400">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>500 Ad Copies/month</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>All Ad Formats</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Priority Support</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                <button className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
            <div className="bg-black/50 p-8 rounded-xl border border-gray-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-6">$199<span className="text-lg text-gray-400">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Unlimited Ad Copies</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>Custom Ad Formats</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>24/7 Priority Support</span>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <FiZap className="text-[#D4AF37] w-5 h-5" />
                    <span>API Access</span>
                  </li>
                </ul>
                <button className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 