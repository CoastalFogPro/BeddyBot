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
        theme: 'Space Adventure'
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
