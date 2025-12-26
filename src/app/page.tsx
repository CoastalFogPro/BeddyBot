import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Sparkles, Volume2, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        <div className="star-twinkle" style={{ top: '10%', left: '20%', animationDelay: '0s' }}>✨</div>
        <div className="star-twinkle" style={{ top: '20%', right: '15%', animationDelay: '1s', fontSize: '1rem' }}>✨</div>
        <div className="star-twinkle" style={{ top: '60%', left: '10%', animationDelay: '2s' }}>✨</div>
        <div className="star-twinkle" style={{ top: '80%', right: '30%', animationDelay: '1.5s', fontSize: '0.8rem' }}>✨</div>

        {/* Shooting Stars */}
        <div className="shooting-star" style={{ top: '10%', right: '10%', animationDelay: '0s' }}></div>
        <div className="shooting-star" style={{ top: '30%', right: '5%', animationDelay: '4s' }}></div>
        <div className="shooting-star" style={{ top: '60%', right: '20%', animationDelay: '7s' }}></div>

        {/* Planets */}
        <div className="planet" style={{
          top: '15%', left: '5%', width: '80px', height: '80px',
          background: 'linear-gradient(45deg, #ff9f43, #ff6b6b)',
          boxShadow: '0 0 30px rgba(255, 159, 67, 0.3)',
          animationDelay: '0s'
        }}></div>

        <div className="planet" style={{
          bottom: '20%', right: '5%', width: '120px', height: '120px',
          background: 'linear-gradient(45deg, #4D96FF, #6BCB77)',
          boxShadow: '0 0 40px rgba(77, 150, 255, 0.3)',
          opacity: 0.6,
          animationDelay: '2s'
        }}></div>

        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(77, 150, 255, 0.1) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '70vw', height: '70vw',
          background: 'radial-gradient(circle, rgba(255, 159, 67, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }} />
      </div>

      {/* Navbar */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(26, 34, 56, 0.6)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ fontWeight: '800', fontSize: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '2rem' }}>🤖</span> BeddyBot
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" style={{
            fontWeight: '600',
            color: 'white',
            textDecoration: 'none',
            padding: '0.6rem 1.2rem',
            opacity: 0.9,
            transition: 'opacity 0.2s'
          }} className="hover:opacity-100">
            Login
          </Link>
          <Link href="/signup" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">

        {/* LEFT COMPONENT: Hero Image (Desktop Left) */}
        <div className="hero-blob-container">
          <Image
            src="/hero-robot.png"
            alt="BeddyBot Reading a Story"
            width={500}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            className="hero-robot-image"
            priority
          />
        </div>

        {/* RIGHT COMPONENT: Content (Desktop Right) */}
        <div className="hero-content-wrapper">
          {/* Status Badge */}
          <div style={{
            fontSize: '0.85rem',
            color: 'var(--color-accent-green)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(26, 34, 56, 0.6)',
            padding: '0.6rem 1.2rem',
            borderRadius: '50px',
            border: '1px solid rgba(0, 255, 148, 0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--color-accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-accent-green)', animation: 'pulse 2s infinite' }}></span>
            System Online • v2.0
          </div>

          {/* Main Heading */}
          <div>
            <h1 style={{
              fontSize: 'clamp(3rem, 5vw, 5.5rem)',
              fontWeight: '900',
              lineHeight: '1.1',
              marginBottom: '0.5rem',
              textShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              <span className="animate-wiggle" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>Magical</span> Bedtime Stories
            </h1>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              Lovingly Created & Read by
              <span style={{
                background: 'linear-gradient(135deg, #4D96FF 0%, #6BCB77 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                display: 'inline-block',
                transform: 'rotate(-2deg)',
                padding: '0 0.5rem'
              }}>BeddyBot</span>
            </h2>
          </div>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px',
            lineHeight: '1.6',
            fontWeight: '500',
            marginBottom: '1rem'
          }}>
            Create personalized adventures in seconds. Safe, educational, and fun for your little dreamers.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', display: 'flex', gap: '0.8rem', alignItems: 'center', boxShadow: '0 10px 30px -5px rgba(255, 159, 67, 0.4)', borderRadius: '50px' }}>
              Start My Adventure <ArrowRight size={24} />
            </Link>
          </div>
        </div>

      </section>

      {/* Feature Grid */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <FeatureCard
          icon={<Sparkles size={32} color="#ff9f43" />}
          title="Infinite Imagination"
          desc="Never read the same story twice. From space dinos to underwater castles, if you can dream it, BeddyBot can write it."
        />
        <FeatureCard
          icon={<Shield size={32} color="#4D96FF" />}
          title="100% Kid-Safe Zone"
          desc="Our advanced Safety Shield automatically blocks scary or inappropriate topics, keeping bedtime peaceful and worry-free."
        />
        <FeatureCard
          icon={<Volume2 size={32} color="#00E096" />}
          title="Storytime Narration"
          desc="Too tired to read? Let our friendly robot voices read the story aloud with perfect pacing and warmth."
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
