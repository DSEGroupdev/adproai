import Head from 'next/head'
import { FiZap, FiTarget, FiLayers, FiTrendingUp, FiCheck, FiArrowRight, FiChevronDown, FiCopy } from 'react-icons/fi';
import Image from 'next/image';
import WhiteHeroTest from '../components/WhiteHeroTest';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    productName: '',
    audience: '',
    usps: '',
    tone: 'Persuasive'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data.data.raw);
      } else {
        setResult('Error generating ad copy. Please try again.');
      }
    } catch (error) {
      setResult('Error generating ad copy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Ad Pro AI</title>
        <meta name="description" content="Generate high-converting ad copy with AI. Built for marketers, entrepreneurs, and agencies." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="bg-black text-white min-h-screen">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800/50 w-full z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Image 
              src="/logo.jpg" 
              alt="Ad Pro AI Logo" 
              height={224} 
              width={800}
              className="h-56 w-auto"
              priority
            />
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#generate" className="text-gray-300 hover:text-gold transition-colors font-bold">Generate</a>
              <a href="#features" className="text-gray-300 hover:text-gold transition-colors font-bold">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-gold transition-colors font-bold">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-gold transition-colors font-bold">Login</a>
              <button className="bg-gold hover:bg-gold-hover text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold">
                Try for Free
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-48">
          <WhiteHeroTest />
        </div>

        {/* White Divider */}
        <div className="border-t-2 border-white/20 w-full"></div>

        {/* Form Section */}
        <section id="generate" className="bg-[#111] py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-xl shadow-xl p-8 border-2 border-gold">
              <h2 className="text-3xl font-bold mb-8 text-center text-white">Generate Your Ad Copy</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="productName">
                    Product/Service Name
                  </label>
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-black placeholder-gray-500"
                    placeholder="Enter your product or service name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="audience">
                    Target Audience
                  </label>
                  <input
                    id="audience"
                    name="audience"
                    type="text"
                    value={formData.audience}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-black placeholder-gray-500"
                    placeholder="Who is your target audience?"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="usps">
                    Unique Selling Points
                  </label>
                  <textarea
                    id="usps"
                    name="usps"
                    value={formData.usps}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-black placeholder-gray-500 h-32"
                    placeholder="What makes your product/service unique?"
                  />
                </div>

                <div className="relative">
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="tone">
                    Tone
                  </label>
                  <select
                    id="tone"
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-black appearance-none pr-10"
                  >
                    <option>Persuasive</option>
                    <option>Friendly</option>
                    <option>Urgent</option>
                    <option>Funny</option>
                    <option>Professional</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-11 text-gray-400 pointer-events-none" />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-hover text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Ad Copy'}
                </button>

                {result && (
                  <div className="mt-8 p-6 bg-[#1a1a1a] rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Generated Ad Copy:</h3>
                      <button
                        onClick={handleCopy}
                        className="text-sm text-gold hover:text-gold-hover transition-colors flex items-center gap-2"
                      >
                        <FiCopy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-300">{result}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* White Divider */}
        <div className="border-t-2 border-white/20 w-full"></div>

        {/* Features Section */}
        <section id="features" className="bg-[#0a0a0a] py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Why Choose Ad Pro AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <FiZap className="text-gold text-5xl mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Copy</h3>
                <p className="text-gray-300">Generate high-converting ad copy using advanced AI technology</p>
              </div>
              <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <FiTarget className="text-gold text-5xl mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-white">Targeted Ads</h3>
                <p className="text-gray-300">Create ads specifically tailored to your target audience</p>
              </div>
              <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <FiLayers className="text-gold text-5xl mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-white">Platform-Ready Output</h3>
                <p className="text-gray-300">Get copy ready to use on any advertising platform</p>
              </div>
              <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <FiTrendingUp className="text-gold text-5xl mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4 text-white">Built for Conversions</h3>
                <p className="text-gray-300">Optimized for maximum engagement and conversion rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* White Divider */}
        <div className="border-t-2 border-white/20 w-full"></div>

        {/* Pricing Section */}
        <section id="pricing" className="bg-[#111] py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <h3 className="text-2xl font-bold mb-4 text-gold">Free</h3>
                <p className="text-4xl font-bold mb-6 text-white">$0<span className="text-lg text-gray-400">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> 5 ad copies per month
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Basic tone options
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Standard support
                  </li>
                </ul>
                <button className="w-full bg-gold hover:bg-gold-hover text-white font-bold px-6 py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl shadow-xl p-8 hover:scale-105 transition-all duration-300 border-2 border-gold">
                <h3 className="text-2xl font-bold mb-4 text-gold">Pro</h3>
                <p className="text-4xl font-bold mb-6 text-white">$29<span className="text-lg text-gray-400">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> 50 ad copies per month
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> All tone options
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Priority support
                  </li>
                </ul>
                <button className="w-full bg-gold hover:bg-gold-hover text-white font-bold px-6 py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-gold">
                <h3 className="text-2xl font-bold mb-4 text-gold">Agency</h3>
                <p className="text-4xl font-bold mb-6 text-white">$99<span className="text-lg text-gray-400">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Unlimited ad copies
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Custom tone options
                  </li>
                  <li className="flex items-center text-gray-300">
                    <FiCheck className="text-gold mr-3" /> Dedicated support
                  </li>
                </ul>
                <button className="w-full bg-gold hover:bg-gold-hover text-white font-bold px-6 py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800/50 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Image 
                src="/logo.jpg" 
                alt="Ad Pro AI Logo" 
                height={56} 
                width={200}
                className="h-14 w-auto"
              />
              <div className="flex space-x-8">
                <a href="#" className="text-gray-300 hover:text-gold transition-colors">Terms</a>
                <a href="#" className="text-gray-300 hover:text-gold transition-colors">Privacy</a>
                <a href="#" className="text-gray-300 hover:text-gold transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 