// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="relative w-[1500px] h-[1500px] mb-8">
        <Image
          src="/logo.png"
          alt="Ad Pro AI Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
      <p className="text-xl text-gray-300">We're working on something amazing</p>
    </div>
  );
} 