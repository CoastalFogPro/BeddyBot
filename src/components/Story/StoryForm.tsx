"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StoryForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: 'James',
        age: '5',
        gender: 'Boy',
        theme: 'Space Adventure'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Navigate to story view with query params
        const params = new URLSearchParams(formData);
        router.push(`/story/123?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        }}>
            <div style={{
                textAlign: 'center',
                borderBottom: '2px dashed rgba(255,255,255,0.1)',
                paddingBottom: '1rem',
                marginBottom: '0.5rem'
            }}>
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent-blue)' }}>
                    ✨ Story Workshop
                </h3>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Child's Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-base"
                    placeholder="e.g. Comdr. James"
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Age */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Age Level</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="input-base"
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1} style={{ color: 'black' }}>{i + 1} Years</option>
                            ))}
                        </select>
                        <div style={{
                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                            pointerEvents: 'none', color: 'white', fontSize: '0.8rem'
                        }}>▼</div>
                    </div>
                </div>

                {/* Gender */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <label style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Hero Type</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="input-base"
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option style={{ color: 'black' }}>Boy</option>
                            <option style={{ color: 'black' }}>Girl</option>
                            <option style={{ color: 'black' }}>Non-binary</option>
                        </select>
                        <div style={{
                            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                            pointerEvents: 'none', color: 'white', fontSize: '0.8rem'
                        }}>▼</div>
                    </div>
                </div>
            </div>

            {/* Theme */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Adventure Theme</label>
                <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="input-base"
                    placeholder="e.g. Robot Dinosaurs on Mars"
                />
            </div>

            <button
                type="submit"
                className="btn-primary"
                style={{
                    marginTop: '1rem',
                    width: '100%',
                    fontSize: '1.2rem'
                }}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Initializing...' : '🚀 Launch Story'}
            </button>

        </form>
    );
}
