const { withClerkMiddleware } = require("@clerk/nextjs/server");

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
  trailingSlash: false
}

module.exports = withClerkMiddleware(nextConfig); 