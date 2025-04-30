// Trigger redeploy - April 23, 2024
// Force redeploy with error handling - April 23, 2024
// Force deployment - April 23, 2024 - v3
import Head from 'next/head'
import Image from 'next/image'
import { FiZap, FiHelpCircle, FiCopy, FiCheck, FiArrowRight, FiChevronRight, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import Footer from '../components/Footer'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Home() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    targetAudience: '',
    tone: '',
    platform: '',
    maxLength: 100
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState({
    headline: '',
    body: '',
    callToAction: ''
  });
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState({
    headline: false,
    body: false,
    callToAction: false
  });
  const [checkoutError, setCheckoutError] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [errorPlan, setErrorPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [adsRemaining, setAdsRemaining] = useState(5); // Default for free plan

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push('/sign-up');
      return;
    }

    if (adsRemaining <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          product: formData.productName,
          audience: formData.targetAudience,
          usp: formData.productDescription,
          tone: formData.tone,
          platform: formData.platform,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "An error occurred while generating ad copy.");
      }

      const data = await res.json();
      const formattedResult = {
        headline: data.headline,
        body: data.body,
        callToAction: data.callToAction || data.cta || ''
      };
      setResult(formattedResult);
      setShowModal(true);
    } catch (error) {
      setError(error.message || "Failed to generate ad copy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (section) => {
    try {
      await navigator.clipboard.writeText(result[section]);
      setCopied(prev => ({ ...prev, [section]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [section]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const scrollToForm = () => {
    document.getElementById('generator-form').scrollIntoView({ behavior: 'smooth' })
  }

  const handleCheckout = async (planKey, priceId) => {
    if (planKey === 'free') {
      if (!isSignedIn) {
        router.push('/sign-up');
        return;
      }
      // For free plan, just redirect to dashboard
      router.push('/dashboard');
      return;
    }

    try {
      setLoadingPlan(planKey);
      setErrorPlan(null);

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorPlan(planKey);
    } finally {
      setLoadingPlan(null);
    }
  };

  const ResultModal = ({ isOpen, onClose, result, platform }) => {
    const { user } = useUser();
    const isFullTargetingAvailable = ["PRO", "AGENCY"].includes(user?.plan || "FREE");

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-[#181c23] rounded-xl p-6 max-w-2xl w-full space-y-6 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Generated Ad Copy</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Headline Section */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#D4AF37] font-medium">Headline</h4>
              <div className="relative group">
                <button
                  onClick={() => handleCopy('headline')}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  {copied.headline ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white">{result.headline}</p>
          </div>

          {/* Body Section */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#D4AF37] font-medium">Body</h4>
              <div className="relative group">
                <button
                  onClick={() => handleCopy('body')}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  {copied.body ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{result.body}</p>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#D4AF37] font-medium">Call to Action</h4>
              <div className="relative group">
                <button
                  onClick={() => handleCopy('callToAction')}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  {copied.callToAction ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white">{result.callToAction}</p>
          </div>

          {/* Targeting Section */}
          {result.targeting && (
            <div
              className={`relative p-4 rounded-lg ${
                isFullTargetingAvailable 
                  ? "bg-gray-800/50" 
                  : "bg-gray-800/30 blur-sm hover:blur-none transition-all cursor-pointer"
              }`}
              onClick={() => {
                if (!isFullTargetingAvailable) {
                  window.location.href = "/pricing";
                }
              }}
              title={!isFullTargetingAvailable ? "Upgrade to view targeting suggestions" : ""}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[#D4AF37] font-medium">Suggested Targeting for {platform}</h4>
                {!isFullTargetingAvailable && (
                  <span className="bg-[#D4AF37] text-black text-xs px-2 py-1 rounded">
                    PRO Feature
                  </span>
                )}
              </div>
              <pre className="text-white text-sm whitespace-pre-wrap">{result.targeting}</pre>

              {!isFullTargetingAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                    Upgrade to PRO to unlock targeting suggestions
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <title>Ad Pro AI - Generate High-Converting Ad Copy</title>
        <meta name="description" content="Generate high-converting ad copy instantly with AI" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Ad Pro AI Logo"
                  width={200}
                  height={56}
                  className="h-14 w-auto"
                />
              </div>
              {isSignedIn && (
                <span className="text-gray-300">Welcome, {user.firstName || user.emailAddresses[0].emailAddress}</span>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={scrollToForm}
                    className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition"
                  >
                    Generate Ad Copy
                  </button>
                  <button
                    onClick={() => window.location.href = '/sign-out'}
                    className="text-gray-300 hover:text-white transition"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <a
                  href="/sign-in"
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {isSignedIn ? (
              <>
                <p className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium">
                  Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
                  Ready to Create Your Next <span className="text-[#D4AF37]">High-Converting</span> Ad?
                </h1>
              </>
            ) : (
              <>
                <p className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium">
                  Join 100+ marketers using Ad Pro AI
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
                  Generate <span className="text-[#D4AF37]">High-Converting</span> Ad Copy in Seconds
                </h1>
              </>
            )}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Built for marketers, entrepreneurs, and agencies.<br />No writing skills needed.
            </p>
            <div className="pt-8">
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    router.push('/sign-up');
                    return;
                  }
                  scrollToForm();
                }}
                className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#C19B2E] transition"
              >
                {isSignedIn ? 'Generate Ad Copy Now' : 'Try it Free'} <FiArrowRight className="inline-block ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ad Pro AI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <FiZap className="text-[#D4AF37] text-4xl mb-4 relative z-10" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Generate High-Converting Ad Copy</h3>
              <p className="text-gray-400 relative z-10">Create compelling ad copy that drives results using advanced AI technology.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <FiHelpCircle className="text-[#D4AF37] text-4xl mb-4 relative z-10" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Target the Right Audience</h3>
              <p className="text-gray-400 relative z-10">Optimize your ads for specific demographics and interests.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <FiCopy className="text-[#D4AF37] text-4xl mb-4 relative z-10" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Boost ROI Instantly</h3>
              <p className="text-gray-400 relative z-10">See immediate improvements in your ad performance and conversion rates.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">Fill Out Form</h3>
              <p className="text-gray-400 relative z-10">Enter your product details and preferences</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-black font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">AI Writes Copy</h3>
              <p className="text-gray-400 relative z-10">Our AI generates optimized ad copy</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full transform group-hover:scale-150 transition-transform duration-500" />
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-black font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 relative z-10">Copy & Launch</h3>
              <p className="text-gray-400 relative z-10">Use the generated copy in your ads</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator Form Section */}
      <section id="generator-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Generate Your Ad Copy</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#D4AF37] cursor-help" />
                      <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Enter the name of your product or service
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#D4AF37] cursor-help" />
                      <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Describe your ideal customer (e.g., "Small business owners", "Tech enthusiasts")
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Description</label>
                <div className="relative">
                  <textarea
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                  <div className="absolute right-2 top-2 group">
                    <FiHelpCircle className="text-gray-400 hover:text-[#D4AF37] cursor-help" />
                    <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      Describe your product's key features and benefits
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <div className="relative">
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="">Select Tone</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="convincing">Convincing</option>
                    </select>
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#D4AF37] cursor-help" />
                      <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Choose the tone that best matches your brand voice
                      </div>
                    </div>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <FiChevronRight className="text-gray-400 transform rotate-90" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <div className="relative">
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] appearance-none"
                      required
                    >
                      <option value="">Select Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#D4AF37] cursor-help" />
                      <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Select where your ad will appear
                      </div>
                    </div>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <FiChevronRight className="text-gray-400 transform rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-medium hover:bg-[#C19B2E] transition flex items-center justify-center"
              >
                {isLoading ? 'Generating...' : 'Generate Ad Copy'}
                {!isLoading && <FiChevronRight className="ml-2" />}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {result.headline && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Generated Ad Copy</h3>
                  <button
                    onClick={() => handleCopy('headline')}
                    className="text-[#D4AF37] hover:text-[#C19B2E] transition flex items-center"
                  >
                    <FiCopy className="mr-1" /> Copy
                  </button>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="whitespace-pre-wrap">{result.headline}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <h3 className="text-xl font-bold mb-4">Free Plan</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-base text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> 5 ad copies per month
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Basic templates
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Standard support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('free', 'price_1RIAmRJwadrZOO3V3lWJFtKa')}
                disabled={loadingPlan === 'free'}
                className="w-full bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition flex items-center justify-center"
              >
                {loadingPlan === 'free' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Get Started'
                )}
              </button>
              {errorPlan === 'free' && (
                <p className="text-red-400 text-sm mt-2">Failed to start checkout. Please try again.</p>
              )}
            </div>

            {/* Starter Plan */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <h3 className="text-xl font-bold mb-4">Starter Plan</h3>
              <p className="text-3xl font-bold mb-4">$9<span className="text-base text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> 20 ad copies per month
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Basic templates
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Email support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('starter', 'price_1RIAjaJwadrZOO3VczgJKJQV')}
                disabled={loadingPlan === 'starter'}
                className="w-full bg-[#D4AF37] text-black py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition flex items-center justify-center"
              >
                {loadingPlan === 'starter' ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Get Started'
                )}
              </button>
              {errorPlan === 'starter' && (
                <p className="text-red-400 text-sm mt-2">Failed to start checkout. Please try again.</p>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800/50 p-6 rounded-xl border-2 border-[#D4AF37] flex flex-col relative transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-4">Pro Plan</h3>
              <p className="text-3xl font-bold mb-4">$29<span className="text-base text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Unlimited ad copies
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Advanced templates
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Priority support
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Custom tone training
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('pro', 'price_1RIAkSJwadrZOO3VURG7Cssr')}
                disabled={loadingPlan === 'pro'}
                className="w-full bg-[#D4AF37] text-black py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition flex items-center justify-center"
              >
                {loadingPlan === 'pro' ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Get Started'
                )}
              </button>
              {errorPlan === 'pro' && (
                <p className="text-red-400 text-sm mt-2">Failed to start checkout. Please try again.</p>
              )}
            </div>

            {/* Agency Plan */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <h3 className="text-xl font-bold mb-4">Agency Plan</h3>
              <p className="text-3xl font-bold mb-4">$99<span className="text-base text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Unlimited ad copies
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> All templates
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> Priority support
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> API access
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#D4AF37] mr-2" /> White-label options
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('agency', 'price_1RIAlZJwadrZOO3VkLGYKMi5')}
                disabled={loadingPlan === 'agency'}
                className="w-full bg-[#D4AF37] text-black py-2 rounded-lg font-medium hover:bg-[#C19B2E] transition flex items-center justify-center"
              >
                {loadingPlan === 'agency' ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Get Started'
                )}
              </button>
              {errorPlan === 'agency' && (
                <p className="text-red-400 text-sm mt-2">Failed to start checkout. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Writing Better Ads Today</h2>
          <p className="text-gray-400 mb-8">No credit card required. Cancel anytime.</p>
          <button
            onClick={scrollToForm}
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#C19B2E] transition"
          >
            Generate Ad Copy Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Result Modal */}
      {showModal && (
        <ResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          result={result}
          platform={formData.platform}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Upgrade Your Plan</h3>
            <p className="text-gray-300 mb-6">
              You've reached your monthly limit. Upgrade your plan to continue creating winning ad copy!
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Maybe Later
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#C19B2E] transition"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ads Remaining Counter */}
      {isSignedIn && (
        <div className="fixed top-4 right-4 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">
            <span className="text-[#D4AF37] font-medium">{adsRemaining}</span> ads remaining this month
          </p>
        </div>
      )}
    </div>
  )
} 