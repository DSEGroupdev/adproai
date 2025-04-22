// Trigger redeploy - April 16, 2024
// Force redeploy with styles - April 16, 2024
// Force deployment - April 16, 2024 - v2
import Head from 'next/head'

export default function Home() {
  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      <Head>
        <title>Ad Pro AI - Coming Soon</title>
        <meta name="description" content="Ad Pro AI - Coming Soon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <img 
        src="/logo.jpg"
        alt="Ad Pro AI Logo"
        style={{
          width: '900px',
          height: '900px',
          objectFit: 'contain',
          marginBottom: '3rem'
        }}
      />
      
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
        textAlign: 'center',
        lineHeight: 1.75
      }}>
        We're crafting something extraordinary for marketers and entrepreneurs
      </p>
    </div>
  )
} 