/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['vercel.app'],
  },
  // Configure for Vercel deployment
  output: 'standalone',
  distDir: '.next',
  trailingSlash: true,
  // Update rewrites to exclude API routes
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
        has: [
          {
            type: 'prefix',
            value: '(?!/api)',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 