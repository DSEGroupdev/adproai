// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#000000', 
      minHeight: '100vh',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background: #000000;
          }
        `}</style>
      </Head>

      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        minHeight: '100vh'
      }}>
        <div style={{ position: 'relative', width: '900px', height: '900px', marginBottom: '3rem' }}>
          <Image
            src="/logo.jpg"
            alt="Ad Pro AI Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
            quality={100}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#D4AF37', 
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}>
            COMING SOON
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            color: '#D1D5DB',
            maxWidth: '42rem',
            margin: '0 auto',
            lineHeight: '1.75'
          }}>
            We're crafting something extraordinary for marketers and entrepreneurs
          </p>
        </div>
      </main>
    </div>
  );
} 