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
  // Remove basePath as it's not needed
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ]
  },
}

module.exports = nextConfig 