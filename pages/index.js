// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'
import { FiZap, FiHelpCircle, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'
import { motion } from 'framer-motion'

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

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
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
            <div className="relative w-[300px] h-[120px]">
              <Image 
                src="/logo.jpg" 
                alt="Ad Pro AI Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={scrollToFeatures} className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                Features
              </button>
              <button onClick={scrollToPricing} className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                Pricing
              </button>
              <button onClick={scrollToForm} className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                Try it Free
              </button>
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
              <motion.button 
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Try it Free
                <FiZap className="w-5 h-5" />
              </motion.button>
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to create high-converting ad copy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800"
            >
              <div className="text-[#D4AF37] text-4xl mb-4">
                <FiZap />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-400">Generate professional ad copy in seconds, not hours</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800"
            >
              <div className="text-[#D4AF37] text-4xl mb-4">
                <FiCopy />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multiple Formats</h3>
              <p className="text-gray-400">Create ads for any platform with optimized formats</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800"
            >
              <div className="text-[#D4AF37] text-4xl mb-4">
                <FiCheck />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">High Converting</h3>
              <p className="text-gray-400">Proven templates that drive real results</p>
            </motion.div>
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
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl">
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white"
                  required
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <motion.button
                type="submit"
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Ad Copy
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </section>

      {/* Ad Output Section */}
      {adOutput && (
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-black p-8 rounded-xl border border-gray-800 shadow-xl">
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
                  <motion.button
                    onClick={() => copyToClipboard(`${adOutput.headline}\n\n${adOutput.body}\n\n${adOutput.cta}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>50 ad generations</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Email support</span>
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Get Started
              </motion.button>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border-2 border-[#D4AF37] relative"
            >
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-sm font-bold px-4 py-1 rounded-tl-lg rounded-br-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Professional</h3>
              <div className="text-4xl font-bold text-white mb-4">$79<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>200 ad generations</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Advanced templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Team collaboration</span>
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Get Started
              </motion.button>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-4">Custom</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Unlimited generations</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Custom templates</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <FiCheck className="text-[#D4AF37] w-5 h-5" />
                  <span>API access</span>
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-[300px] h-[120px] mb-8">
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