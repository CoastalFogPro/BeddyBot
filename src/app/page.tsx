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
            Personalized Stories • v2.0
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
            Every story is uniquely crafted for your child. They'll hear their own name, enjoy adventures tailored to their age, and explore worlds built around what they love most—from dinosaurs to princesses, space to unicorns.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.2rem', display: 'flex', gap: '0.8rem', alignItems: 'center', boxShadow: '0 10px 30px -5px rgba(255, 159, 67, 0.4)', borderRadius: '50px' }}>
              Get Started Today! <ArrowRight size={24} />
            </Link>
          </div>
        </div>

      </section>

      {/* Feature Grid */}
      <section style={{
        padding: '4rem 2rem 6rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            How BeddyBot Works Its Magic
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            Three simple steps to create unforgettable bedtime adventures
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          <FeatureCard
            icon="/robot-personalization.png"
            title="Built Just for Them"
            desc="Enter your child's name, age, and interests. Watch as BeddyBot creates a one-of-a-kind adventure where they're the hero, perfectly tailored to their imagination."
            accentColor="rgba(255, 159, 67, 0.2)"
          />
          <FeatureCard
            icon="/robot-safety.png"
            title="Safe & Age-Appropriate"
            desc="Every story adapts to your child's age with vocabulary and themes that are just right. Our Safety Shield ensures content is always gentle and worry-free."
            accentColor="rgba(77, 150, 255, 0.2)"
          />
          <FeatureCard
            icon="/robot-audio.png"
            title="Hear Their Name Spoken"
            desc="BeddyBot reads the personalized story aloud with warm, friendly voices. Your child will light up hearing their own name in the adventure."
            accentColor="rgba(107, 203, 119, 0.2)"
          />
        </div>
      </section>

      {/* App Interface Showcase */}
      <section style={{
        padding: '6rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            See BeddyBot in Action
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
            From creation to bedtime magic in just a few clicks
          </p>
        </div>

        {/* Screenshots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Screenshot 1 - Story Form */}
          <div className="screenshot-float" style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(145deg, rgba(26, 34, 56, 0.6), rgba(26, 34, 56, 0.3))',
            animation: 'float-screenshot 6s ease-in-out infinite',
            animationDelay: '0s'
          }}>
            <Image
              src="/screenshot-story-form.png"
              alt="Story Creation Interface"
              width={600}
              height={800}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                ✨ Personalize Every Detail
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
                Enter your child's name, age, and favorite themes
              </p>
            </div>
          </div>

          {/* Screenshot 2 - Story Result */}
          <div className="screenshot-float" style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(77, 150, 255, 0.3)',
            border: '1px solid rgba(77, 150, 255, 0.2)',
            background: 'linear-gradient(145deg, rgba(26, 34, 56, 0.6), rgba(26, 34, 56, 0.3))',
            animation: 'float-screenshot 6s ease-in-out infinite',
            animationDelay: '3s'
          }}>
            <Image
              src="/screenshot-story-result.png"
              alt="Story Result Interface"
              width={600}
              height={800}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(77, 150, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                🎨 Beautiful Stories Come to Life
              </h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
                Illustrated adventures with audio narration
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc, accentColor }: { icon: string, title: string, desc: string, accentColor: string }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(26, 34, 56, 0.8), rgba(26, 34, 56, 0.4))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
      className="feature-card-hover"
    >
      {/* Accent gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: 0.6
      }} />

      {/* Icon Container */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: accentColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: `0 10px 30px ${accentColor}`,
        position: 'relative'
      }}>
        <Image
          src={icon}
          alt={title}
          width={50}
          height={50}
          style={{ filter: 'brightness(1.1)' }}
        />
      </div>

      <h3 style={{
        fontSize: '1.6rem',
        fontWeight: '800',
        marginBottom: '1rem',
        color: 'white'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '1.05rem',
        opacity: 0.85,
        lineHeight: '1.7',
        color: 'rgba(255,255,255,0.9)'
      }}>
        {desc}
      </p>
    </div>
  );
}
