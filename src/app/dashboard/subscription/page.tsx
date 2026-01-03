"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(`Checkout failed: ${data.error || 'Unknown error'}`);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handlePortal = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST',
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to open billing portal');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const success = searchParams.get('success');

    // Auto-sync on success return
    useEffect(() => {
        if (success) {
            fetch('/api/stripe/sync', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    console.log("Subscription Synced:", data);
                    // Force a router refresh to update server components/context
                    router.refresh();
                })
                .catch(err => console.error("Sync failed", err));
        }
    }, [success, router]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'white', position: 'relative' }}>

            <Link href="/dashboard" style={{
                position: 'absolute', top: '0rem', left: '0rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: 'white', opacity: 0.7, textDecoration: 'none', fontWeight: 'bold'
            }} className="hover:opacity-100 transition-opacity">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>

            <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Unlock Endless Magic ✨
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                    Create more stories and keep them forever.
                </p>
                {success && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(75, 181, 67, 0.2)',
                        border: '1px solid #4bb543',
                        borderRadius: '12px',
                        display: 'inline-block'
                    }}>
                        🎉 Subscription Successful! Welcome to the club!
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Free Tier */}
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Starter</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' }}>Free</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', textAlign: 'left' }}>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> 1 Personalized Story</li>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> Basic Themes</li>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> Save to Library</li>
                    </ul>
                    <button disabled style={{ ...buttonStyle, opacity: 0.5, cursor: 'default' }}>Current Plan</button>
                </div>

                {/* Monthly */}
                <div style={{ ...cardStyle, border: '2px solid #4D96FF', boxShadow: '0 0 30px rgba(77, 150, 255, 0.2)' }}>
                    <div style={{
                        position: 'absolute', top: 0, right: 0, background: '#4D96FF',
                        padding: '0.2rem 1rem', borderRadius: '0 0 0 12px', fontSize: '0.8rem', fontWeight: '700'
                    }}>POPULAR</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Monthly Magic</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' }}>$9.99<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mo</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', textAlign: 'left' }}>
                        <li style={liStyle}><Check size={20} color="#4D96FF" /> Save up to 30 Stories</li>
                        <li style={liStyle}><Check size={20} color="#4D96FF" /> Priority Generation</li>
                        <li style={liStyle}><Check size={20} color="#4D96FF" /> All Themes Unlocked</li>
                    </ul>
                    <button
                        onClick={() => handleSubscribe('monthly')}
                        disabled={loading}
                        style={{ ...buttonStyle, background: '#4D96FF' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Subscribe Monthly'}
                    </button>
                </div>

                {/* Yearly */}
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Annual Adventure</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '1rem 0' }}>$49.99<span style={{ fontSize: '1rem', opacity: 0.6 }}>/yr</span></div>
                    <div style={{ color: '#4bb543', fontWeight: '700', fontSize: '0.9rem' }}>Save 58%</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', textAlign: 'left' }}>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> Save up to 30 Stories</li>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> 2 Months Free</li>
                        <li style={liStyle}><Check size={20} color="#4bb543" /> All Themes Unlocked</li>
                    </ul>
                    <button
                        onClick={() => handleSubscribe('yearly')}
                        disabled={loading}
                        style={{ ...buttonStyle, background: 'linear-gradient(135deg, #4D96FF 0%, #6BCB77 100%)' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Subscribe Yearly'}
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <p style={{ marginBottom: '1rem', opacity: 0.6 }}>Already a member?</p>
                <button
                    onClick={handlePortal}
                    disabled={loading}
                    style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                        padding: '0.8rem 2rem', borderRadius: '50px', color: 'white', cursor: 'pointer'
                    }}
                >
                    Manage Subscription
                </button>
            </div>
        </div>
    );
}

const cardStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '2rem',
    textAlign: 'center' as const,
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
    overflow: 'hidden'
};

const liStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1rem',
    opacity: 0.9
};

const buttonStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s'
};
