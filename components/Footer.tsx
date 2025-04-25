import Link from 'next/link'
import Image from 'next/image'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Image
              src="/logo.png"
              alt="Ad Pro AI Logo"
              width={150}
              height={42}
              className="h-10 w-auto"
            />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-300">
              <Link href="/privacy" className="hover:text-[#D4AF37] transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#D4AF37] transition">
                Terms of Service
              </Link>
              <Link href="/impressum" className="hover:text-[#D4AF37] transition">
                Legal Disclosure
              </Link>
              <ContactForm />
            </div>
            <div className="mt-4 text-center md:text-left">
              <p className="text-xs text-gray-400">
                © 2025 Ad Pro AI. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This site complies with GDPR, CCPA, and UAE data protection regulations.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 text-sm text-gray-400">
            © {new Date().getFullYear()} DSE Group FZCO
          </div>
        </div>
      </div>
    </footer>
  )
} 