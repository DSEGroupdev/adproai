// Trigger redeploy - April 23, 2024
// Force redeploy with error handling - April 23, 2024
// Force deployment - April 23, 2024 - v3
import Head from 'next/head'
import Image from 'next/image'
import { FiZap, FiHelpCircle, FiCopy, FiCheck, FiArrowRight, FiChevronRight, FiX, FiAlertCircle } from 'react-icons/fi'
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
    maxLength: 100,
    location: '',
    demographic: '',
    radius: '',
    keywords: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [adResult, setAdResult] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [error, setError] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [copied, setCopied] = useState({
    headline: false,
    body: false,
    callToAction: false
  });
  const [checkoutError, setCheckoutError] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [errorPlan, setErrorPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showLastAdWarning, setShowLastAdWarning] = useState(false);
  const [showAdLimitModal, setShowAdLimitModal] = useState(false);

  const handleGenerateAd = async (e) => {
    if (e) {
      e.preventDefault(); // Prevent form submission
    }
    try {
      setIsLoading(true);
      setError(null);
      setAdResult(null);
      setShowAdLimitModal(false);
      setShowUpgradeModal(false);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          product: formData.productName,
          audience: formData.targetAudience,
          usp: formData.productDescription,
          tone: formData.tone,
          platform: formData.platform,
          location: formData.location,
          demographic: formData.demographic,
          radius: formData.radius,
          keywords: formData.keywords
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === 'ad_limit_reached') {
        setShowUpgradeModal(true);
        return;
      }

      if (!res.ok || !data.valid || !data.headline || !data.body || !data.callToAction) {
        console.error("Ad generation failed or invalid response:", data);
        throw new Error(data.error || "Invalid response format from server");
      }

      // Set the result with proper structure
      setAdResult({
        headline: data.headline,
        body: data.body,
        callToAction: data.callToAction,
        targeting: data.targeting || { radius: '', demographic: '', keywords: '' },
        recommendedBudget: data.recommendedBudget || ''
      });
      setRemaining(data.adsRemaining);

      // Only increment ad counter after successful, validated, and rendered result
      await fetch("/api/track-ad-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (section) => {
    try {
      await navigator.clipboard.writeText(adResult[section]);
      setCopied(prev => ({ ...prev, [section]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [section]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const scrollToForm = () => {
    document.getElementById('generator-form').scrollIntoView({ behavior: 'smooth' })
  }

  const handleCheckout = async (planKey) => {
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
        body: JSON.stringify({ 
          priceId: 'price_1RJZw4JwadrZOO3VHKkVArLR' // Updated Premium price ID
        }),
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
    if (!isOpen) return null;

    // Helper for copy buttons
    const getCopyHandler = (field, value) => async () => {
      try {
        await navigator.clipboard.writeText(value || '');
        setCopied(prev => ({ ...prev, [field]: true }));
        setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    const targeting = result?.targeting || {};

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-[#181c23] rounded-xl p-6 max-w-2xl w-full space-y-6 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Generated Campaign Plan</h3>
            <button
              onClick={() => onClose()}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Headline */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Headline</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('headline', result?.headline)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.headline ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{result?.headline}</p>
          </div>

          {/* Body */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Body</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('body', result?.body)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.body ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{result?.body}</p>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Call to Action</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('callToAction', result?.callToAction)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.callToAction ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{result?.callToAction}</p>
          </div>

          {/* Targeting Radius */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Targeting Radius</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('radius', targeting?.radius)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.radius ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{targeting?.radius}</p>
          </div>

          {/* Demographic Targeting */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Demographic Targeting</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('demographic', targeting?.demographic)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.demographic ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{targeting?.demographic}</p>
          </div>

          {/* Keyword Suggestions */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Keyword Suggestions</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('keywords', targeting?.keywords)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.keywords ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{targeting?.keywords}</p>
          </div>

          {/* Recommended Budget */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[#FFD700] font-medium">Recommended Budget</h4>
              <div className="relative group">
                <button
                  onClick={getCopyHandler('recommendedBudget', result?.recommendedBudget)}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {copied.recommendedBudget ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </button>
                <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Copy
                </div>
              </div>
            </div>
            <p className="text-white whitespace-pre-line">{result?.recommendedBudget}</p>
          </div>
        </div>
      </div>
    );
  };

  // Last Ad Warning Modal
  const LastAdWarningModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-[#111] border border-[#FFD700] p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center text-white">
        <h2 className="text-xl font-semibold text-[#FFD700] mb-3">⚠️ Last Free Ad Remaining</h2>
        <p className="text-gray-300 mb-4">
          You have 1 free ad generation remaining. Upgrade now to unlock 100 generations per month!
        </p>
        <div className="bg-gray-900/50 p-4 rounded-lg mb-5">
          <p className="text-2xl font-bold text-[#FFD700]">$12.99<span className="text-base text-gray-400">/month</span></p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLastAdWarning(false)}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-md"
          >
            Use Last Free Ad
          </button>
          <button
            onClick={() => handleCheckout('premium')}
            className="px-4 py-2 bg-[#FFD700] hover:bg-[#e6c200] text-black font-semibold rounded-md"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );

  // Upgrade Modal
  const UpgradeModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#181c23] rounded-xl p-8 max-w-md w-[90%] mx-auto relative text-center">
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
        >
          <FiX size={24} />
        </button>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">You've Reached Your Limit</h3>
        <p className="text-gray-300 mb-6 text-center">
          You've generated 3 ads this month on the free plan. Upgrade to Premium to unlock 100 ads/month, advanced targeting, and professional copy tailored for every platform.
        </p>
        <div className="bg-gray-800/50 p-4 rounded-lg mb-6 flex justify-center items-center">
          <p className="text-2xl font-bold text-[#FFD700] text-center">$12.99<span className="text-base text-gray-400">/month</span></p>
        </div>
        <button
          onClick={() => handleCheckout('premium')}
          className="w-full px-6 py-3 bg-[#FFD700] hover:bg-[#e6c200] text-black rounded-lg font-medium transition text-center"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );

  const AdLimitModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={() => setShowAdLimitModal(false)}
    >
      <div 
        className="bg-[#181c23] rounded-xl p-8 max-w-md w-[90%] mx-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setShowAdLimitModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
        >
          <FiX size={24} />
        </button>
        <h3 className="text-2xl font-bold text-white mb-4">You've Reached Your Limit</h3>
        <p className="text-gray-300 mb-6">
          You've generated 3 ads this month on the free plan. Upgrade to Premium to unlock 100 ads/month, advanced targeting, and professional copy tailored for every platform.
        </p>
        <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
          <p className="text-2xl font-bold text-[#FFD700]">$12.99<span className="text-base text-gray-400">/month</span></p>
        </div>
        <button
          onClick={() => handleCheckout('premium')}
          className="w-full px-6 py-3 bg-[#FFD700] hover:bg-[#e6c200] text-black rounded-lg font-medium transition"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );

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
                    className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#e6c200] transition"
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
                  className="bg-[#FFD700] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#e6c200] transition"
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
                <p className="text-[#FFD700] text-sm uppercase tracking-wider font-medium">
                  Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
                  Ready to Create Your Next <span className="text-[#FFD700]">High-Converting</span> Ad?
                </h1>
              </>
            ) : (
              <>
                <p className="text-[#FFD700] text-sm uppercase tracking-wider font-medium">
                  Join 100+ marketers using Ad Pro AI
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
                  Generate <span className="text-[#FFD700]">High-Converting</span> Ad Copy in Seconds
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
                className="bg-[#FFD700] text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#e6c200] transition"
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
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <FiZap className="text-[#FFD700] text-4xl mb-4 relative z-10" />
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">Generate High-Converting Ad Copy</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">Create compelling ad copy that drives results using advanced AI technology.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <FiHelpCircle className="text-[#FFD700] text-4xl mb-4 relative z-10" />
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">Target the Right Audience</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">Optimize your ads for specific demographics and interests.</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <FiCopy className="text-[#FFD700] text-4xl mb-4 relative z-10" />
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">Boost ROI Instantly</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">See immediate improvements in your ad performance and conversion rates.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#181c23]/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center mb-4 relative z-10">
                <span className="text-black font-bold text-xl">1</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">Fill Out Form</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">Enter your product details and preferences</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center mb-4 relative z-10">
                <span className="text-black font-bold text-xl">2</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">AI Writes Copy</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">Our AI generates optimized ad copy</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, filter: 'brightness(1.08) contrast(1.08)' }}
              className="bg-[#181c23] p-8 rounded-xl relative overflow-hidden group transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.10)] border border-[#FFD700]/40 flex flex-col items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center mb-4 relative z-10">
                <span className="text-black font-bold text-xl">3</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2 relative z-10 text-[#FFD700]">Copy & Paste</h3>
              <p className="text-lg font-semibold text-white/90 relative z-10">Use the generated copy in your ads</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator Form Section */}
      <section id="generator-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Generate Your Ad Copy</h2>
            <form onSubmit={handleGenerateAd} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      required
                    />
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
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
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      required
                    />
                    <div className="absolute right-2 top-2 group">
                      <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    required
                  />
                  <div className="absolute right-2 top-2 group">
                    <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
                    <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      Describe your product's key features and benefits
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium">Tone</label>
                    <span className="ml-2 group relative">
                      <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Choose the tone that best matches your brand voice
                      </div>
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none"
                    >
                      <option value="">Select Tone</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="convincing">Convincing</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-3">
                      <FiChevronRight className="text-gray-400 transform rotate-90" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium">Platform</label>
                    <span className="ml-2 group relative">
                      <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        Select where your ad will appear
                      </div>
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none"
                      required
                    >
                      <option value="">Select Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-3">
                      <FiChevronRight className="text-gray-400 transform rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Target Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    placeholder="e.g., San Diego, CA"
                  />
                  <div className="absolute right-2 top-2 group">
                    <FiHelpCircle className="text-gray-400 hover:text-[#FFD700] cursor-help" />
                    <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      Enter a city, region, or country to target your ad geographically (optional)
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FFD700] text-black py-3 rounded-lg font-medium hover:bg-[#e6c200] transition flex items-center justify-center"
              >
                {isLoading ? 'Generating...' : 'Generate Ad Copy'}
                {!isLoading && <FiChevronRight className="ml-2" />}
              </button>
            </form>

            {remaining !== null && (
              <p className="text-sm text-gray-400 mt-2">
                {remaining} ad generations remaining this month
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>
            )}

            {adResult && (
              <div className="mt-6 bg-black text-white p-4 rounded-lg border border-gold shadow">
                <h3 className="text-lg font-semibold text-gold mb-2">Generated Ad</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gold font-medium mb-1">Headline</h4>
                    <p className="text-white">{adResult.headline}</p>
                  </div>
                  <div>
                    <h4 className="text-gold font-medium mb-1">Body</h4>
                    <p className="text-white whitespace-pre-line">{adResult.body}</p>
                  </div>
                  <div>
                    <h4 className="text-gold font-medium mb-1">Call to Action</h4>
                    <p className="text-white">{adResult.callToAction}</p>
                  </div>
                  {adResult.targeting && (
                    <div>
                      <h4 className="text-gold font-medium mb-1">Targeting Suggestions</h4>
                      <div className="space-y-2">
                        {adResult.targeting.demographics && (
                          <div>
                            <h5 className="text-white font-medium">Demographics</h5>
                            <ul className="list-disc list-inside text-gray-300">
                              {adResult.targeting.demographics.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {adResult.targeting.geographics && (
                          <div>
                            <h5 className="text-white font-medium">Geographics</h5>
                            <ul className="list-disc list-inside text-gray-300">
                              {adResult.targeting.geographics.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-12">Try all features free, upgrade for more generations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <h3 className="text-xl font-bold mb-4">Free Trial</h3>
              <p className="text-3xl font-bold mb-4">$0</p>
              <p className="text-gray-400 mb-6">Try everything we offer</p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> 3 ad generations
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> All premium features included
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> Advanced targeting
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> All templates
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('free')}
                disabled={loadingPlan === 'free'}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition flex items-center justify-center"
              >
                {loadingPlan === 'free' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-[#FFD700] flex flex-col relative transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:hover:translate-y-[-4px]">
              <div className="absolute top-0 right-0 bg-[#FFD700] text-black px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <p className="text-3xl font-bold mb-4">$12.99<span className="text-base text-gray-400">/month</span></p>
              <p className="text-gray-400 mb-6">For consistent content creators</p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> 100 ad generations monthly
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> All premium features included
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> Advanced targeting
                </li>
                <li className="flex items-center">
                  <FiCheck className="text-[#FFD700] mr-2" /> Priority support
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('premium')}
                disabled={loadingPlan === 'premium'}
                className="w-full bg-[#FFD700] text-black py-3 rounded-lg font-medium hover:bg-[#e6c200] transition flex items-center justify-center"
              >
                {loadingPlan === 'premium' ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Upgrade to Premium'
                )}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400">All plans include:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              <div className="flex items-center text-sm text-gray-300">
                <FiCheck className="text-[#FFD700] mr-2" /> Advanced targeting
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FiCheck className="text-[#FFD700] mr-2" /> All premium features
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <FiCheck className="text-[#FFD700] mr-2" /> Cancel anytime
              </div>
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
            className="bg-[#FFD700] text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#e6c200] transition"
          >
            Generate Ad Copy Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Result Modal */}
      {adResult && (
        <ResultModal
          isOpen={true}
          onClose={() => setAdResult(null)}
          result={adResult}
          platform={formData.platform}
        />
      )}

      {/* Show Ad Limit Modal */}
      {showAdLimitModal && <AdLimitModal />}

      {/* Show Last Ad Warning Modal */}
      {showLastAdWarning && <LastAdWarningModal />}

      {/* Show Upgrade Modal */}
      {showUpgradeModal && <UpgradeModal />}
    </div>
  )
} 