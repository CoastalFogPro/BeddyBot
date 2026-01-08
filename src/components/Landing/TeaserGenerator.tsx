"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, ArrowRight, Play, Save, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const THEMES = [
    "Princesses & Castles",
    "Fairies & Magic Gardens",
    "Unicorns & Magical Horses",
    "Dinosaurs",
    "Space & Rockets",
    "Jungles & Safaris",
    "Pirates & Treasure",
    "Under the Sea",
    "Superheroes"
];

const STYLES = [
    { id: 'rhyme', label: 'Rhyme & Rattle', icon: '🎵', desc: 'Bouncy Seuss-like rhymes' },
    { id: 'funny', label: 'Funny & Flat', icon: '🤪', desc: 'Silly & deadpan humor' },
    { id: 'snuggle', label: 'Snuggle & Dream', icon: '🌙', desc: 'Calm, sensory & sleepy' },
];

const NARRATORS = [
    { id: 'female', label: 'Mama Bear', icon: '👩' },
    { id: 'male', label: 'Papa Bear', icon: '👨' },
];

export default function TeaserGenerator() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Boy',
        theme: 'Space & Rockets'
    });

    // State is purely client-side; data is lost on refresh (Ephemeral by design)
    // This ensures sample stories are only saved temporarily during the session and get purged after.
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string, imageUrl: string } | null>(null);
    const [error, setError] = useState('');
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/generate-teaser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate');

            setResult({ text: data.text, imageUrl: data.imageUrl });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{
            padding: '4rem 1rem 6rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            width: '100%',
            background: 'linear-gradient(180deg, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0.02) 100%)',
            borderTop: '1px solid rgba(251, 146, 60, 0.2)',
            borderBottom: '1px solid rgba(251, 146, 60, 0.05)',
            margin: '4rem auto',
            maxWidth: '1200px',
            borderRadius: '40px'
        }}>
            {/* Header */}
            {!result && (
                <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', zIndex: 2 }}>
                    <h2 className="animate-text-gradient" style={{
                        fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(to right, #4D96FF, #fb923c, #4D96FF)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem'
                    }}>
                        Try the Magic Right Now
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
                        Create a real bedtime story in seconds. No credit card required.
                    </p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!result ? (
                    /* --- FORM VIEW (Replicating StoryForm) --- */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ width: '100%', maxWidth: '600px', zIndex: 2 }}
                    >
                        <form onSubmit={handleSubmit} style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '32px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                        }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#e2e8f0' }}>Child&apos;s Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Leo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '1.1rem', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#e2e8f0' }}>Age</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="5"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        style={{
                                            width: '100%', padding: '1rem', borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', fontSize: '1.1rem', outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#e2e8f0' }}>Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        style={{
                                            width: '100%', padding: '1rem', borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', fontSize: '1.1rem', outline: 'none',
                                            appearance: 'none'
                                        }}
                                    >
                                        <option value="Boy">Boy</option>
                                        <option value="Girl">Girl</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', color: '#e2e8f0' }}>Story Theme</label>
                                <select
                                    value={THEMES.includes(formData.theme) ? formData.theme : 'custom'}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'custom') setFormData({ ...formData, theme: '' });
                                        else setFormData({ ...formData, theme: val });
                                    }}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '1.1rem', outline: 'none', marginBottom: '0.5rem',
                                        appearance: 'none'
                                    }}
                                >
                                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                                    <option disabled>(This is only a partial list)</option>
                                    <option value="custom">✨ Create your own topic...</option>
                                </select>

                                {(!THEMES.includes(formData.theme) || formData.theme === '') && (
                                    <input
                                        type="text"
                                        placeholder="e.g. A robot painting a rainbow"
                                        value={formData.theme}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                        style={{
                                            width: '100%', padding: '1rem', borderRadius: '12px',
                                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', fontSize: '1.1rem', outline: 'none'
                                        }}
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* LOCKED FEATURES: STYLE */}
                            <div style={{ opacity: 0.7, position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#e2e8f0' }}>Story Style</label>
                                    <span style={{ fontSize: '0.8rem', background: '#fbbf24', color: 'black', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Lock size={12} /> Unlock in App
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {STYLES.map((style) => (
                                        <div key={style.id} style={{
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(255,255,255,0.02)',
                                            padding: '0.75rem', borderRadius: '12px',
                                            display: 'flex', flexDirection: 'column', gap: '0.25rem',
                                            cursor: 'not-allowed'
                                        }}>
                                            <div style={{ fontSize: '1.2rem' }}>{style.icon}</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{style.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* LOCKED FEATURES: NARRATOR */}
                            <div style={{ opacity: 0.7, position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <label style={{ fontWeight: 'bold', color: '#e2e8f0' }}>Narrator</label>
                                    <span style={{ fontSize: '0.8rem', background: '#fbbf24', color: 'black', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Lock size={12} /> Unlock in App
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {NARRATORS.map((n) => (
                                        <div key={n.id} style={{
                                            flex: 1,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: 'rgba(255,255,255,0.02)',
                                            padding: '0.8rem', borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            cursor: 'not-allowed'
                                        }}>
                                            <span>{n.icon}</span>
                                            <span>{n.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && <p style={{ color: '#f87171', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                            <button
                                disabled={loading}
                                type="submit"
                                style={{
                                    marginTop: '1rem',
                                    padding: '1.2rem', borderRadius: '50px',
                                    background: 'linear-gradient(135deg, #4D96FF 0%, #6BCB77 100%)',
                                    color: 'white', fontWeight: '800', fontSize: '1.2rem',
                                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.8 : 1,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem',
                                    boxShadow: '0 10px 30px rgba(77, 150, 255, 0.3)',
                                    transition: 'transform 0.2s'
                                }}
                            >
                                {loading ? 'Creating Magic (Please Wait)...' : <><Sparkles size={24} /> Create Free Story</>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    /* --- RESULT VIEW (Replicating StoryReader) --- */
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ width: '100%', maxWidth: '900px', zIndex: 10 }}
                    >
                        {/* SIGNUP POPUP OVERLAY */}
                        {showSignupPrompt && (
                            <div style={{
                                position: 'fixed', inset: 0, zIndex: 100,
                                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                            }} onClick={() => setShowSignupPrompt(false)}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        background: '#1e293b', padding: '2.5rem', borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.1)', maxWidth: '450px',
                                        textAlign: 'center', position: 'relative'
                                    }}
                                >
                                    <button onClick={() => setShowSignupPrompt(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>Unlock This Feature!</h3>
                                    <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
                                        To <strong>Save</strong> stories to your library and listen to the magical <strong>Audio Narration</strong>, you need a free account.
                                    </p>
                                    <Link href="/signup" style={{ textDecoration: 'none' }}>
                                        <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                            Create Free Account <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                                        </button>
                                    </Link>
                                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>No credit card required for free tier</p>
                                </motion.div>
                            </div>
                        )}

                        <div style={{
                            background: '#0f172a', /* Dark background like reader */
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* READER TOP BAR */}
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <button onClick={() => setResult(null)} style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', opacity: 0.7 }}>
                                    ← Back
                                </button>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={14} fill="#fbbf24" /> PREVIEW MODE
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', minHeight: '600px' }}>
                                {/* LEFT: IMAGE */}
                                <div style={{ position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {result.imageUrl ? (
                                        <Image
                                            src={result.imageUrl}
                                            alt="Story illustration"
                                            width={1024}
                                            height={1024}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ color: 'white', opacity: 0.5 }}>No Image Generated</div>
                                    )}

                                    {/* Action Bar Overlay */}
                                    <div style={{
                                        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                                        padding: '0.8rem 1.5rem', borderRadius: '50px',
                                        display: 'flex', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <button
                                            onClick={() => setShowSignupPrompt(true)}
                                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                                        >
                                            <div style={{ background: 'white', color: 'black', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Play size={20} fill="black" style={{ marginLeft: '2px' }} />
                                            </div>
                                            Play
                                        </button>
                                        <button
                                            onClick={() => setShowSignupPrompt(true)}
                                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                                        >
                                            <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Save size={20} />
                                            </div>
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT: TEXT */}
                                <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', maxHeight: '700px', overflowY: 'auto' }}>
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '2rem' }}>
                                        The Adventures of {formData.name}
                                    </h2>

                                    <div style={{ fontSize: '1.25rem', lineHeight: '1.9', color: '#e2e8f0', flex: 1 }}>
                                        {result.text.split('\n').map((para, i) => (
                                            <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
                                        ))}

                                        <div style={{
                                            marginTop: '2rem', padding: '2rem', background: 'rgba(255, 159, 67, 0.1)',
                                            border: '1px dashed rgba(255, 159, 67, 0.5)', borderRadius: '16px',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1.5rem', color: '#fdba74' }}>
                                                ...and that&apos;s just the beginning of the adventure!
                                            </p>
                                            <p style={{ marginBottom: '1.5rem' }}>
                                                Unlock the full story and listen to the audio narration.
                                            </p>
                                            <Link href="/signup">
                                                <button className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '50px' }}>
                                                    Finish the Story <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
