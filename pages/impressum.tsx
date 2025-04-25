import Footer from '../components/Footer'
import Head from 'next/head'

export default function Impressum() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Legal Disclosure - Ad Pro AI</title>
        <meta name="description" content="Legal Disclosure for Ad Pro AI - Your AI-powered ad copy generator" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-[#D4AF37]">Legal Disclosure</h1>
          <div className="space-y-8 text-gray-300">
            <p className="text-lg">
              This website is operated by:
            </p>
            
            <section className="space-y-2">
              <p className="font-semibold text-white text-xl">
                DSE Group FZCO
              </p>
              <p>
                Dubai Silicon Oasis<br />
                IFZA Business Park<br />
                Dubai, United Arab Emirates
              </p>
              <p>
                Email:{' '}
                <a className="text-[#D4AF37] hover:underline" href="mailto:dan@dsegroupae.com">
                  dan@dsegroupae.com
                </a>
              </p>
            </section>

            <section className="space-y-2">
              <p>
                Managing Director: Daniel Sedlak<br />
                Company License No: Available upon request<br />
                VAT Registration No: N/A (currently not VAT registered)
              </p>
            </section>

            <p className="text-sm text-gray-400 pt-8">
              Last updated: April 25, 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 