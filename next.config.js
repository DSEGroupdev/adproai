/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Remove static export to let Vercel handle SSR
  distDir: '.next',
  trailingSlash: true,
  // Add basePath for proper routing
  basePath: '',
}

module.exports = nextConfig 