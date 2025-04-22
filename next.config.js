/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['vercel.app'],
  },
  // Remove static export to let Vercel handle SSR
  distDir: '.next',
  trailingSlash: true,
  // Add basePath for proper routing
  basePath: '',
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