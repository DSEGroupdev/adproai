// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'
import { FiZap, FiHelpCircle, FiCopy, FiCheck } from 'react-icons/fi'
import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    usp: '',
    tone: 'professional'
  })

  const [adOutput, setAdOutput] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const tooltips = {
    product: "What are you selling? Be specific (e.g., 'Social Media Management Software' or 'Online Fitness Coaching')",
    audience: "Who is your ideal customer? Include demographics, interests, or pain points",
    usp: "What makes your offering unique? List key benefits or features that set you apart",
    tone: "How should your ad sound? Choose a tone that resonates with your audience"
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setAdOutput(data)
    } catch (error) {
      console.error('Error generating ad:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <div className="relative w-[224px] h-[96px]">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={scrollToForm}
                className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Try it Free
                <FiZap className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37] w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37] w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Copy Generator Form */}
      <section id="adCopyForm" className="py-20 bg-black">
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
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="product" className="block text-sm font-medium text-gray-300">
                    Product or Service Name
                  </label>
                  <div className="group relative">
                    <FiHelpCircle className="text-[#D4AF37] w-4 h-4 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {tooltips.product}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Social Media Management Tool"
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="audience" className="block text-sm font-medium text-gray-300">
                    Target Audience
                  </label>
                  <div className="group relative">
                    <FiHelpCircle className="text-[#D4AF37] w-4 h-4 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {tooltips.audience}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Small Business Owners"
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="usp" className="block text-sm font-medium text-gray-300">
                    Unique Selling Points
                  </label>
                  <div className="group relative">
                    <FiHelpCircle className="text-[#D4AF37] w-4 h-4 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {tooltips.usp}
                    </div>
                  </div>
                </div>
                <textarea
                  id="usp"
                  value={formData.usp}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  placeholder="e.g., Save 10 hours per week, Automated posting, Analytics included"
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-300">
                    Tone
                  </label>
                  <div className="group relative">
                    <FiHelpCircle className="text-[#D4AF37] w-4 h-4 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {tooltips.tone}
                    </div>
                  </div>
                </div>
                <select
                  id="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  required
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Ad Copy'}
                <FiZap className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Ad Output Section */}
      {adOutput && (
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-black p-8 rounded-xl border border-gray-800">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Headline</h3>
                    <p className="text-xl font-bold text-white">{adOutput.headline}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Ad Copy</h3>
                    <p className="text-white">{adOutput.body}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Call to Action</h3>
                    <p className="text-white">{adOutput.cta}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${adOutput.headline}\n\n${adOutput.body}\n\n${adOutput.cta}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-[224px] h-[96px] mb-8">
              <Image
                src="/logo.jpg"
                alt="Ad Pro AI Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Ad Pro AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 