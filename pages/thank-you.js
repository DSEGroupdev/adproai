import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ThankYou() {
  const router = useRouter();
  const { session_id } = router.query;

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Thank You - Ad Pro AI</title>
        <meta name="description" content="Thank you for subscribing to Ad Pro AI" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-6">
            Thank You for Subscribing!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your subscription has been successfully processed.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-medium hover:bg-[#C19B2E] transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
} 