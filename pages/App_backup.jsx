import React, { useState } from 'react';
import { FiZap, FiTarget, FiLayers, FiTrendingUp, FiCheck, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

export default function App() {
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [usps, setUsps] = useState('');
  const [tone, setTone] = useState('Persuasive');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, audience, usps, tone }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.data.raw);
      } else {
        throw new Error(data.error || 'Failed to generate ad copy');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error generating ad copy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800/50 fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image 
            src="/logo.jpg" 
            alt="Ad Pro AI Logo" 
            height={56} 
            width={200}
            className="h-14 w-auto"
            priority
          />
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#generate" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Generate</a>
            <a href="#features" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Pricing</a>
            <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Login</a>
            <button className="bg-[#D4AF37] hover:bg-yellow-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              Try for Free
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-black pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-[#D4AF37] tracking-wider uppercase font-medium mb-4">Join 100+ marketers using Ad Pro AI</p>
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
                <FiCheck className="text-[#D4AF37]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-[#D4AF37]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="generate" className="bg-[#111] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-xl shadow-xl p-8 border border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Generate Your Ad Copy</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="productName">
                  Product/Service Name
                </label>
                <input
                  id="productName"
                  type="text"
                  className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder-gray-500"
                  placeholder="Enter your product or service name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="audience">
                  Target Audience
                </label>
                <input
                  id="audience"
                  type="text"
                  className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder-gray-500"
                  placeholder="Who is your target audience?"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="usps">
                  Unique Selling Points
                </label>
                <textarea
                  id="usps"
                  className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white placeholder-gray-500 h-32"
                  placeholder="What makes your product/service unique?"
                  value={usps}
                  onChange={(e) => setUsps(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="tone">
                  Tone
                </label>
                <select
                  id="tone"
                  className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-white"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option>Persuasive</option>
                  <option>Friendly</option>
                  <option>Urgent</option>
                  <option>Funny</option>
                  <option>Professional</option>
                </select>
              </div>

              <button
                className="w-full bg-[#D4AF37] hover:bg-[#caa733] text-black font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Ad Copy'}
                {!loading && <FiArrowRight className="w-4 h-4" />}
              </button>

              {output && (
                <div className="mt-8 p-6 bg-[#111] rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Generated Ad Copy:</h3>
                    <button
                      onClick={handleCopy}
                      className="text-sm text-[#D4AF37] hover:text-[#caa733] transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#0a0a0a] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Why Choose Ad Pro AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <FiZap className="text-[#D4AF37] text-5xl mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Copy</h3>
              <p className="text-gray-300">Generate high-converting ad copy using advanced AI technology</p>
            </div>
            <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <FiTarget className="text-[#D4AF37] text-5xl mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-white">Targeted Ads</h3>
              <p className="text-gray-300">Create ads specifically tailored to your target audience</p>
            </div>
            <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <FiLayers className="text-[#D4AF37] text-5xl mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-white">Platform-Ready Output</h3>
              <p className="text-gray-300">Get copy ready to use on any advertising platform</p>
            </div>
            <div className="text-center p-8 bg-[#111] rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <FiTrendingUp className="text-[#D4AF37] text-5xl mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-white">Built for Conversions</h3>
              <p className="text-gray-300">Optimized for maximum engagement and conversion rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[#111] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">Free</h3>
              <p className="text-4xl font-bold mb-6 text-white">$0<span className="text-lg text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> 5 ad copies per month
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Basic tone options
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Standard support
                </li>
              </ul>
              <button className="w-full bg-[#D4AF37] hover:bg-[#caa733] text-black font-bold px-6 py-3 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl shadow-xl p-8 hover:scale-105 transition-all duration-300 border-2 border-[#D4AF37]">
              <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">Pro</h3>
              <p className="text-4xl font-bold mb-6 text-white">$29<span className="text-lg text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> 50 ad copies per month
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> All tone options
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Priority support
                </li>
              </ul>
              <button className="w-full bg-[#D4AF37] hover:bg-[#caa733] text-black font-bold px-6 py-3 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-800">
              <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">Agency</h3>
              <p className="text-4xl font-bold mb-6 text-white">$99<span className="text-lg text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Unlimited ad copies
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Custom tone options
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-[#D4AF37] mr-3" /> Dedicated support
                </li>
              </ul>
              <button className="w-full bg-[#D4AF37] hover:bg-[#caa733] text-black font-bold px-6 py-3 rounded-lg transition-colors">
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
              height={64} 
              width={200}
              className="h-16 w-auto"
            />
            <div className="flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

