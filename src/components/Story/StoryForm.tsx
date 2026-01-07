"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const THEMES = [
    "Princesses & Castles",
    "Fairies & Magic Gardens",
    "Unicorns & Magical Horses",
    "Mermaids & the Ocean",
    "Dolls & Toy Adventures",
    "Butterflies, Flowers & Nature",
    "Space & Rockets",
    "Dinosaurs",
    "Trains, Cars & Trucks",
    "Pirates & Treasure Islands",
    "Knights & Dragons",
    "Jungle Animals",
    "Animals",
    "Magic",
    "Underwater Worlds",
    "Outer Space",
    "Adventure",
    "Friendship"
];

interface StoryFormProps {
    initialData?: {
        childId?: string;
        name?: string;
        age?: string;
        gender?: string;
    }
}

export default function StoryForm({ initialData }: StoryFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: 'James',
        age: '5',
        gender: 'Boy',
        theme: 'Space Adventure',
        style: 'rhyme',
        narrator: 'female'
    });

    // Sync state with props when they change
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name || 'James',
                age: initialData.age || '5',
                gender: initialData.gender || 'Boy'
            }));
        }
    }, [initialData]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const params = new URLSearchParams(formData);

        // Explicitly check for childId in initialData
        if (initialData?.childId) {
            params.append('childId', initialData.childId);
        }

        router.push(`/story/123?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2rem',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)'
        }}>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Child's Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-base"
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="input-base"
                        required
                    />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Gender</label>
                    <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="input-base"
                    >
                        <option value="Boy">Boy</option>
                        <option value="Girl">Girl</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Story Theme</label>
                <select
                    value={THEMES.includes(formData.theme) ? formData.theme : 'custom'}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                            setFormData({ ...formData, theme: '' });
                        } else {
                            setFormData({ ...formData, theme: val });
                        }
                    }}
                    className="input-base"
                    style={{ marginBottom: '0.5rem' }}
                >
                    {THEMES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="custom">✨ Create your own topic...</option>
                </select>

                {(!THEMES.includes(formData.theme) || formData.theme === '') && (
                    <input
                        type="text"
                        value={formData.theme}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        placeholder="e.g. A robot who learns to paint"
                        className="input-base"
                        autoFocus
                        required
                    />
                )}
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>Story Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { id: 'rhyme', label: 'Rhyme & Rattle', icon: '🎵', desc: 'Bouncy Seuss-like rhymes' },
                        { id: 'funny', label: 'Funny & Flat', icon: '🤪', desc: 'Silly & deadpan humor' },
                        { id: 'snuggle', label: 'Snuggle & Dream', icon: '🌙', desc: 'Calm, sensory & sleepy' },
                        { id: 'interactive', label: 'Talk-to-Me', icon: '🗣️', desc: 'Breaks the 4th wall!' },
                        { id: 'adventure', label: 'Grand Adventure', icon: '⚔️', desc: 'Cinematic journey' },
                    ].map((style) => (
                        <div
                            key={style.id}
                            onClick={() => setFormData({ ...formData, style: style.id })}
                            style={{
                                border: formData.style === style.id ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                background: formData.style === style.id ? 'rgba(255, 159, 67, 0.1)' : 'rgba(255,255,255,0.05)',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                            }}
                        >
                            <div style={{ fontSize: '1.2rem' }}>{style.icon}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{style.label}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: '1.2' }}>{style.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500' }}>Narrator Voice</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                        { id: 'female', label: 'Mama Bear', icon: '👩' },
                        { id: 'male', label: 'Papa Bear', icon: '👨' },
                        // { id: 'kid', label: 'Kiddo', icon: '🧒' } // Future expansion
                    ].map((n) => (
                        <div
                            key={n.id}
                            onClick={() => setFormData({ ...formData, narrator: n.id })}
                            style={{
                                flex: 1,
                                border: formData.narrator === n.id ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                background: formData.narrator === n.id ? 'rgba(255, 159, 67, 0.1)' : 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: formData.narrator === n.id ? 'bold' : 'normal'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{n.icon}</span>
                            <span>{n.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    width: '100%'
                }}
            >
                {isLoading ? 'Creating Magic... ✨' : 'BeddyBot Create My Bedtime Tale 🌙'}
            </button>
        </form>
    );
}
