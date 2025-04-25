import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          At Ad Pro AI, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We collect email addresses and other information you provide when you sign up or use our platform. We may also collect usage data and browser details to improve the service.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. How We Use Your Data</h2>
        <p className="mb-4">
          Your data is used to provide our services, improve features, and communicate important updates. We do not sell your information to third parties.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Storage & Security</h2>
        <p className="mb-4">
          Your data is securely stored and encrypted. We use trusted third-party services like Clerk and Stripe to manage authentication and payments.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Your Rights</h2>
        <p className="mb-4">
          You can request data deletion or export by contacting us at <a className="underline" href="mailto:dan@dsegroupae.com">dan@dsegroupae.com</a>.
        </p>
        <p className="text-sm text-gray-600 mt-6">
          DSE Group FZCO, UAE • Last updated: April 25, 2025
        </p>
      </div>
      <Footer />
    </>
  );
} 