"use client";

import { useState } from 'react';
import { X, Sparkles, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState<'Boy' | 'Girl'>('Boy');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            age: formData.get('age'),
            gender: gender // Use state for gender
        };

        try {
            const res = await fetch('/api/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert(result.error || 'Failed to create profile');
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#1a1f36',
                    width: '100%', maxWidth: '450px',
                    borderRadius: '24px',
                    padding: '2rem',
                    position: 'relative',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer'
                    }}
                >
                    <X size={16} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                    New Profile
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Gender Selection Tabs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => setGender('Boy')}
                            style={{
                                padding: '1rem',
                                borderRadius: '16px',
                                border: '2px solid',
                                borderColor: gender === 'Boy' ? '#4facfe' : 'rgba(255,255,255,0.1)',
                                background: gender === 'Boy' ? 'rgba(79, 172, 254, 0.1)' : 'transparent',
                                color: gender === 'Boy' ? '#4facfe' : 'rgba(255,255,255,0.6)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <Rocket size={24} />
                            <span style={{ fontWeight: 'bold' }}>Boy</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setGender('Girl')}
                            style={{
                                padding: '1rem',
                                borderRadius: '16px',
                                border: '2px solid',
                                borderColor: gender === 'Girl' ? '#FF9A9E' : 'rgba(255,255,255,0.1)',
                                background: gender === 'Girl' ? 'rgba(255, 154, 158, 0.1)' : 'transparent',
                                color: gender === 'Girl' ? '#FF9A9E' : 'rgba(255,255,255,0.6)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <Sparkles size={24} />
                            <span style={{ fontWeight: 'bold' }}>Girl</span>
                        </button>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Leo"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Age</label>
                        <input
                            name="age"
                            type="number"
                            required
                            placeholder="e.g. 5"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            background: gender === 'Boy'
                                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                : 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Profile'}
                    </button>

                </form>
            </motion.div>
        </div>
    );
}
