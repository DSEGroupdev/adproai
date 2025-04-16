// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ad Pro AI - Generate High-Converting Ad Copy in Seconds</title>
        <meta name="description" content="Generate high-converting ad copy in seconds with Ad Pro AI. Built for marketers, entrepreneurs, and agencies. No writing skills needed." />
        <link rel="icon" href="/favicon.png" />
        <style jsx global>{`
          body {
            background-color: black;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Head>

      <main className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="relative w-32 h-14">
                <Image
                  src="/logo.png"
                  alt="Ad Pro AI Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-[#D4AF37] tracking-wider uppercase font-medium mb-8">
                Join 100+ marketers using Ad Pro AI
              </p>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white leading-tight">
                Generate High-Converting Ad Copy in Seconds
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Built for marketers, entrepreneurs, and agencies. No writing skills needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <button className="bg-[#D4AF37] hover:bg-[#C19B2E] text-white font-bold py-4 px-10 rounded-lg transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Try it Free
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 