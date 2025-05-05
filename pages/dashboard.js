import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiZap, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingError, setBillingError] = useState(null);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    // Fetch subscription data
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [isSignedIn, router]);

  const handleManageBilling = async () => {
    try {
      setBillingError(null);
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Billing portal error:', error);
      setBillingError('Billing portal not available yet. Please try again later.');
    }
  };

  const handleGenerateAd = () => {
    router.push('/#generate');
  };

  if (!isSignedIn || loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Welcome, {user.emailAddresses[0].emailAddress}!
          </h1>
          <p className="text-xl text-white/80">
            Your AI-Powered Ad Copy Dashboard
          </p>
        </motion.div>

        {/* Subscription Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#181c23] rounded-xl p-8 mb-8 border border-[#FFD700]/40 shadow-[0_0_30px_rgba(255,215,0,0.10)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#FFD700] mb-2">
                {subscription?.plan || 'Pro Plan'}
              </h2>
              <p className="text-white/80">
                {subscription?.adsRemaining || 100} ads remaining this month
              </p>
            </div>
            <FiZap className="text-[#FFD700] text-4xl" />
          </div>
          
          <div className="h-2 bg-[#2a2f3a] rounded-full mb-6">
            <div 
              className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full"
              style={{ width: `${(subscription?.adsUsed / subscription?.adsTotal) * 100 || 0}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-white/60">
            <span>{subscription?.adsUsed || 0} ads used</span>
            <span>{subscription?.adsTotal || 100} total ads</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateAd}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300"
          >
            <FiZap className="text-xl" />
            Generate New Ad
            <FiArrowRight className="text-xl" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManageBilling}
            className="bg-[#181c23] text-[#FFD700] font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 border border-[#FFD700]/40 hover:bg-[#1f232c] transition-all duration-300"
          >
            <FiCreditCard className="text-xl" />
            Manage Billing
            <FiArrowRight className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Billing Error Message */}
        {billingError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
          >
            {billingError}
          </motion.div>
        )}
      </div>
    </div>
  );
} 