import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-600">
      <div className="space-x-2">
        <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-gray-900">Terms</Link>
        <span>•</span>
        <Link href="/impressum" className="hover:text-gray-900">Impressum</Link>
      </div>
    </footer>
  )
} 