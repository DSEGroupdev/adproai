/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure proper static site generation
  output: 'export',
  // Disable server features since we're doing static export
  distDir: '.next',
  // Disable image optimization since we're doing static export
  experimental: {
    images: {
      unoptimized: true,
    },
  },
}

module.exports = nextConfig 