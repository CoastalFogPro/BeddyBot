import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield } from 'lucide-react';

import { auth } from '@/auth';
import TeaserGenerator from '@/components/Landing/TeaserGenerator';
import ScrollReveal from '@/components/Landing/ScrollReveal';
import AppShowcase from '@/components/Landing/AppShowcase';

export default async function LandingPage() {
  const session = await auth();

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
          {session ? (
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* LEFT COMPONENT: Hero Image (Desktop Left) */}
        <div className="hero-blob-container">
          <Image
            src="/hero-robot-reading.jpg"
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
            Every story is uniquely crafted for your child. They&apos;ll hear their own name, enjoy adventures tailored to their age, and explore worlds built around what they love most—from dinosaurs to princesses, space to unicorns.
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
        margin: '2rem auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        background: 'rgba(77, 150, 255, 0.15)', // Lighter Blue Background (Increased opacity)
        borderRadius: '40px',
        boxShadow: 'inset 0 0 40px rgba(77, 150, 255, 0.05)'
      }}>
        <ScrollReveal>
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
              One Click. Endless Bedtime Adventures.
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
              With BeddyBot, customized bedtime stories are ready in seconds
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
        </ScrollReveal>
      </section>

      {/* Safety Shield Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3rem',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)',
        borderRadius: '40px'
      }}>
        <ScrollReveal style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '4rem',
            background: 'rgba(26, 34, 56, 0.4)',
            borderRadius: '40px',
            padding: '3rem',
            width: '100%',
            border: '1px solid rgba(77, 150, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            {/* Image Side */}
            <div style={{ flex: '1 1 300px', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'radial-gradient(circle, rgba(77, 150, 255, 0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0
                }} />
                <Image
                  src="/beddy-police-shield.png"
                  alt="BeddyBot Safety Shield"
                  width={350}
                  height={350}
                  className="animate-shield"
                  style={{
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1,
                    // Filter moved to CSS animation
                  }}
                />
              </div>
            </div>

            {/* Content Side */}
            <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(77, 150, 255, 0.15)',
                borderRadius: '20px',
                color: '#4D96FF',
                fontWeight: '700',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                border: '1px solid rgba(77, 150, 255, 0.3)'
              }}>
                <Shield size={16} /> PARENT-APPROVED PROTECTION
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: '800',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                The BeddyBot <br />
                <span style={{ color: '#4D96FF' }}>Safety Shield</span>
              </h2>

              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                We know that as a parent, safety is your #1 priority. It&apos;s ours too.
                BeddyBot uses advanced AI content filtering to ensure every story is
                gentle, non-violent, and perfectly appropriate for young ears.
              </p>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Strict 'Safe-Mode' AI Content Filtering",
                  "Age-Appropriate Themes & Language",
                  "No Ads, External Links, or Data Sharing",
                  "Parental Control over Topics"
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)' }}>
                    <div style={{
                      minWidth: '24px', height: '24px', borderRadius: '50%', background: '#4bb543',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: '14px'
                    }}>✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* How It Works Banner */}
      <section style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ animation: 'float 6s ease-in-out infinite' }}>
          <Image
            src="/how-it-works-banner.jpg"
            alt="How BeddyBot Works: Create, Pick Theme, Enjoy"
            width={1920}
            height={800}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'block'
            }}
          />
        </div>
      </section>

      {/* App Interface Showcase */}
      <section style={{
        padding: '2rem 2rem 6rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)',
        marginTop: '2rem',
        borderRadius: '40px'
      }}>
        <ScrollReveal>
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
              Personalized Bedtime Stories For Your Child <br />
              <span style={{ fontSize: '1.1em', background: 'linear-gradient(135deg, #4D96FF 0%, #6BCB77 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in Seconds.
              </span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
              From creation to bedtime magic in just a few clicks
            </p>
          </div>

          {/* Interactive Feature Showcase */}
          <div style={{ marginTop: '3rem' }}>
            <AppShowcase />
          </div>
        </ScrollReveal>
      </section>

      {/* Demo / Teaser Section */}
      <ScrollReveal>
        <TeaserGenerator />
      </ScrollReveal>

      {/* Pricing / Plans Section */}
      <section style={{
        padding: '4rem 2rem 6rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(20,20,40,0.6) 100%)',
        marginTop: '2rem',
        borderRadius: '40px 40px 0 0',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              color: 'white'
            }}>
              Choose Your Adventure
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
              Start for free, then unlock unlimited magic.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Free Plan */}
            <PricingCard
              title="Starter"
              price="Free"
              description="Perfect for one bedtime story."
              features={[
                "1 Personalized Story",
                "Standard Themes",
                "Standard Audio"
              ]}
              buttonText="Create Free Account"
              link="/signup"
              isPopular={false}
            />

            {/* Monthly Plan */}
            <PricingCard
              title="Monthly"
              price="$9.99"
              period="/month"
              description="Unlimited stories for active imaginations."
              features={[
                "40 Stories per Month",
                "Save 30 Stories Forever",
                "Priority Generation",
                "Access to All Future Story Themes"
              ]}
              buttonText="Start Monthly"
              link="/signup?plan=monthly"
              isPopular={true}
              accentColor="#4D96FF"
            />

            {/* Yearly Plan */}
            <PricingCard
              title="Yearly"
              price="$49.99"
              period="/year"
              description="Best value for year-round magic."
              features={[
                "Everything in Monthly",
                "2 Months Free",
                "Early Access to New Features",
                "VIP Support"
              ]}
              buttonText="Start Yearly"
              link="/signup?plan=yearly"
              isPopular={false}
              accentColor="#FFD700"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15, 23, 42, 0.8)'
      }}>
        <div style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '2rem' }}>🤖</span> BeddyBot
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
          © {new Date().getFullYear()} BeddyBot. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', position: 'relative', zIndex: 10 }}>
          <a href="mailto:info@coastalcreativelab.com" className="hover:text-white transition-colors" style={{ textDecoration: 'underline', cursor: 'pointer' }}>Contact: info@coastalcreativelab.com</a>
        </div>
      </footer>
    </main>
  );
}

// --- HELPER COMPONENTS ---

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

function PricingCard({ title, price, period, description, features, buttonText, link, isPopular, accentColor = '#ffffff' }: any) {
  return (
    <div style={{
      background: 'rgba(26, 34, 56, 0.6)',
      border: isPopular ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transform: isPopular ? 'scale(1.05)' : 'none',
      boxShadow: isPopular ? `0 20px 40px -10px ${accentColor}40` : 'none',
      zIndex: isPopular ? 2 : 1
    }}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          background: accentColor,
          color: 'black',
          padding: '0.5rem 1.5rem',
          borderBottomLeftRadius: '20px',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          POPULAR
        </div>
      )}

      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: isPopular ? accentColor : 'white' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{price}</span>
        {period && <span style={{ opacity: 0.7, marginLeft: '5px' }}>{period}</span>}
      </div>
      <p style={{ opacity: 0.7, marginBottom: '2rem', minHeight: '3rem' }}>{description}</p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1 }}>
        {features.map((feature: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', opacity: 0.9 }}>
            <span style={{ marginRight: '10px', color: isPopular ? accentColor : '#4bb543' }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link href={link} style={{ textDecoration: 'none' }}>
        <button style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '12px',
          border: 'none',
          background: isPopular ? accentColor : 'rgba(255,255,255,0.1)',
          color: isPopular ? 'black' : 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          fontSize: '1rem'
        }}>
          {buttonText}
        </button>
      </Link>
    </div>
  );
}



