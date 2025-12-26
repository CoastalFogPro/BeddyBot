"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleSignup } from '../auth/actions';

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const result = await handleSignup(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                // Success! Redirect
                router.push('/login?signup=success');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{
                padding: '3rem',
                width: '100%',
                maxWidth: '450px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                background: '#fff',
                color: '#1a2238'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Join BeddyBot</h1>
                    <p style={{ color: '#666' }}>Create an account to save your stories</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Full Name</label>
                        <input name="name" type="text" required className="input-base" placeholder="e.g. Sarah Smith" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Email Address</label>
                        <input name="email" type="email" required className="input-base" placeholder="you@example.com" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Password</label>
                        <input name="password" type="password" required className="input-base" placeholder="••••••••" minLength={6} />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </main>
    );
}
