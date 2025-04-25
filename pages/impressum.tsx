import Footer from '../components/Footer'

export default function Impressum() {
  return (
    <>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Impressum / Legal Disclosure</h1>
        <p className="mb-4">
          This website is operated by:
        </p>
        <p className="mb-4">
          <strong>DSE Group FZCO</strong><br />
          Dubai Silicon Oasis<br />
          IFZA Business Park<br />
          Dubai, United Arab Emirates<br />
          Email: <a className="underline" href="mailto:dan@dsegroupae.com">dan@dsegroupae.com</a>
        </p>
        <p className="mb-4">
          Managing Director: Daniel Sedlak<br />
          Company License No: Available upon request<br />
          VAT Registration No: N/A (currently not VAT registered)
        </p>
        <p className="text-sm text-gray-600 mt-6">
          Last updated: April 25, 2025
        </p>
      </div>
      <Footer />
    </>
  );
} 