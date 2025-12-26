"use client";

import { useState } from 'react';
import Link from 'next/link';
import { handleLogin } from '../auth/actions';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    // In a real app we would use NextAuth's signIn here
    // For now we will structure it but it will fail until configured
    const [error, setError] = useState('');

    /* 
       NOTE: Since we haven't successfully pushed the DB schema or configured auth completely
       due to the missing Env var, this form will be a UI shell ready to be hooked up.
    */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        try {
            const errorMessage = await handleLogin(formData);
            if (errorMessage) {
                setError(errorMessage);
                setLoading(false);
            }
        } catch (err) {
            // NextAuth redirects by throwing an error, so if we get here but it's not a redirect error...
            // Actually handleLogin re-throws the redirect error so it should be handled by Next.js router automatically.
            // If code reaches here, it might be a network error.
            console.error(err);
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
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Login</h1>
                    <p style={{ color: '#666' }}>Access your story dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Email Address</label>
                        <input name="email" type="email" required className="input-base" placeholder="you@example.com" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Password</label>
                        <input name="password" type="password" required className="input-base" placeholder="••••••••" />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Sign up</Link>
                </p>
            </div>
        </main>
    );
}
