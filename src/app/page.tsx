import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div className="glass-panel" style={{
        padding: '3rem',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        border: '3px solid var(--color-border)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Status Light */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem',
          borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
          textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-accent-green)'
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-green)', boxShadow: '0 0 10px var(--color-accent-green)' }}></div>
          System Online
        </div>

        {/* Mascot */}
        <div style={{
          fontSize: '6rem',
          marginBottom: '0',
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(77, 150, 255, 0.4))'
        }}>
          🤖
        </div>

        <div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            lineHeight: '1.1',
            margin: 0,
            textShadow: '0 4px 0 #000'
          }}>
            Beddy<span style={{ color: 'var(--color-primary)' }}>Bot</span>
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '4px', marginTop: '0.5rem' }}>
            Story Generator v1.0
          </p>
        </div>

        <p style={{
          fontSize: '1.35rem',
          color: 'rgba(255,255,255,0.9)',
          lineHeight: '1.6',
          maxWidth: '600px',
          fontWeight: '500'
        }}>
          Create magical, personalized bedtime stories for your child in seconds.
        </p>

        <Link href="/create" className="btn-primary" style={{
          fontSize: '1.5rem',
          padding: '1.25rem 3rem',
          textDecoration: 'none',
          marginTop: '1rem'
        }}>
          🚀 Launch Story Engine
        </Link>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        opacity: 0.5,
        fontSize: '0.875rem'
      }}>
        Trusted by sleepy parents everywhere 🌙
      </div>

    </main>
  );
}
