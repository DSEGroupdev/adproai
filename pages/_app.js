import '../styles/globals.css'
import Head from 'next/head'
import { ClerkProvider } from '@clerk/nextjs'

function MyApp({ Component, pageProps: { ...pageProps } }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <div>Missing Clerk Publishable Key</div>
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      {...pageProps}
    >
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Ad Pro AI - Generate High-Converting Ad Copy</title>
        <meta name="description" content="Generate high-converting ad copy in seconds using AI. Built for marketers, entrepreneurs, and agencies." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adproai.com/" />
        <meta property="og:title" content="Ad Pro AI - Generate High-Converting Ad Copy" />
        <meta property="og:description" content="Use AI to generate persuasive ad copy for your business. Fast, scalable, and beautifully optimized." />
        <meta property="og:image" content="/logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://adproai.com/" />
        <meta name="twitter:title" content="Ad Pro AI - Generate High-Converting Ad Copy" />
        <meta name="twitter:description" content="Use AI to generate persuasive ad copy for your business. Fast, scalable, and beautifully optimized." />
        <meta name="twitter:image" content="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp 