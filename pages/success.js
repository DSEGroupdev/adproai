import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <FiCheckCircle className="text-[#FFD700] text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
          Payment Successful!
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Redirecting to your dashboard...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
      </motion.div>
    </div>
  );
} 