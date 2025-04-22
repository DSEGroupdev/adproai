// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black min-h-screen w-full fixed inset-0">
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="relative w-[900px] h-[900px] mb-12">
          <Image
            src="/logo.jpg"
            alt="Ad Pro AI Logo"
            fill
            priority
            quality={100}
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        <h1 className="text-5xl font-bold text-[#D4AF37] mb-6 tracking-wide">
          COMING SOON
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto text-center leading-relaxed">
          We're crafting something extraordinary for marketers and entrepreneurs
        </p>
      </main>
    </div>
  )
} 