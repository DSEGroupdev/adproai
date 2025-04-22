// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
import Head from 'next/head'
import Image from 'next/image'
import '../styles/globals.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
        <div className="relative w-[900px] h-[900px] mb-12">
          <Image
            src="/logo.jpg"
            alt="Ad Pro AI Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
            quality={100}
          />
        </div>
        
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#D4AF37] mb-6 tracking-wide">
            COMING SOON
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're crafting something extraordinary for marketers and entrepreneurs
          </p>
        </div>
      </main>
    </>
  );
} 