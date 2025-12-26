
import Link from 'next/link';
import { ArrowRight, Shield, Sparkles, Volume2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(26, 34, 56, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '2rem', animation: 'float 3s ease-in-out infinite' }}>🤖</span> BeddyBot
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" style={{
            fontWeight: '600',
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem'
          }}>
            Login
          </Link>
          <Link href="/signup" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(77, 150, 255, 0.1) 0%, transparent 70%)'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: 'var(--color-accent-green)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0, 255, 148, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '50px',
          backdropFilter: 'blur(5px)'
        }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--color-accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-green)' }}></span>
          System Online • v2.0
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '1.5rem',
          maxWidth: '800px'
        }}>
          Unlock Infinite <br />
          <span style={{ color: 'var(--color-primary)' }}>Bedtime Stories</span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255,255,255,0.8)',
          maxWidth: '600px',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Create personalized, magical adventures for your child in seconds.
          Powered by AI, narrated by warm voices, and 100% safe.
        </p>
      </section>

      {/* Feature Grid */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <FeatureCard
          icon={<Sparkles size={32} color="#ff9f43" />}
          title="Unique Stories"
          desc="Never the same story twice. Infinite themes, characters, and adventures generated instantly."
        />
        <FeatureCard
          icon={<Shield size={32} color="#4D96FF" />}
          title="100% Child Safe"
          desc="Strict safety filters and AI moderation ensure every story is appropriate for little ears."
        />
        <FeatureCard
          icon={<Volume2 size={32} color="#00E096" />}
          title="Audio Narration"
          desc="Let BeddyBot read the story aloud with calming male and female voice options."
        />
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: 'rgba(255,255,255,0.03)'
    }}>
      <div style={{
        width: '60px', height: '60px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '0.5rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ opacity: 0.8, lineHeight: '1.6' }}>{desc}</p>
    </div>
  );
}
