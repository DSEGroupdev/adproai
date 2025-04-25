import Footer from '../components/Footer'
import Head from 'next/head'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Privacy Policy - Ad Pro AI</title>
        <meta name="description" content="Privacy Policy for Ad Pro AI - Your AI-powered ad copy generator" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-[#D4AF37]">Privacy Policy</h1>
          <div className="space-y-8 text-gray-300">
            <p className="text-lg">
              At Ad Pro AI, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
              <p>
                We collect email addresses and other information you provide when you sign up or use our platform. We may also collect usage data and browser details to improve the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Data</h2>
              <p>
                Your data is used to provide our services, improve features, and communicate important updates. We do not sell your information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Storage & Security</h2>
              <p>
                Your data is securely stored and encrypted. We use trusted third-party services like Clerk and Stripe to manage authentication and payments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Your Rights</h2>
              <p>
                You can request data deletion or export by contacting us at{' '}
                <a className="text-[#D4AF37] hover:underline" href="mailto:dan@dsegroupae.com">
                  dan@dsegroupae.com
                </a>
              </p>
            </section>

            <p className="text-sm text-gray-400 pt-8">
              DSE Group FZCO, UAE • Last updated: April 25, 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 