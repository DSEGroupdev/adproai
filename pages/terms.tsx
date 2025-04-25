import Footer from '../components/Footer'
import Head from 'next/head'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Terms of Service - Ad Pro AI</title>
        <meta name="description" content="Terms of Service for Ad Pro AI - Your AI-powered ad copy generator" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-[#D4AF37]">Terms of Service</h1>
          <div className="space-y-8 text-gray-300">
            <p className="text-lg">
              By using Ad Pro AI, you agree to the following terms and conditions.
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Use of Service</h2>
              <p>
                Ad Pro AI is provided as a tool for generating advertising content. You are responsible for how you use the output, and you agree not to misuse the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Subscription & Billing</h2>
              <p>
                Paid plans are billed monthly or annually through Stripe. You can cancel at any time, and your access will remain until the end of the billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Limitations & Liability</h2>
              <p>
                Ad Pro AI is provided "as is" without warranties. DSE Group FZCO is not liable for any damages resulting from the use of this tool.
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