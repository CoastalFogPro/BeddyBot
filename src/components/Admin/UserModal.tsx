"use client";

import { useState } from 'react';
import { X, Save, Shield, User } from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface UserModalProps {
    user?: UserData | null;
    onClose: () => void;
    onSave: () => void;
}

export default function UserModal({ user, onClose, onSave }: UserModalProps) {
    const isEditing = !!user;
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'user',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing
                ? `/api/admin/users/${user.id}`
                : '/api/admin/users';

            const method = isEditing ? 'PATCH' : 'POST';

            // Don't send empty password if editing
            const body = { ...formData };
            if (isEditing && !body.password) {
                // @ts-ignore
                delete body.password;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Operation failed');
            }

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '450px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                        {isEditing ? 'Edit User' : 'Create New User'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', outline: 'none', fontSize: '1rem'
                            }}
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', outline: 'none', fontSize: '1rem'
                            }}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {isEditing ? 'New Password (Leave blank to keep)' : 'Password'}
                        </label>
                        <input
                            type="password"
                            required={!isEditing}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', outline: 'none', fontSize: '1rem'
                            }}
                            placeholder="At least 6 characters"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Role</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                style={{
                                    padding: '0.75rem', borderRadius: '12px', border: '1px solid',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                                    background: formData.role === 'user' ? '#3b82f6' : '#0f172a',
                                    borderColor: formData.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: formData.role === 'user' ? 'white' : '#94a3b8'
                                }}
                            >
                                <User size={18} /> User
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                                style={{
                                    padding: '0.75rem', borderRadius: '12px', border: '1px solid',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                                    background: formData.role === 'admin' ? '#a855f7' : '#0f172a',
                                    borderColor: formData.role === 'admin' ? '#a855f7' : 'rgba(255,255,255,0.1)',
                                    color: formData.role === 'admin' ? 'white' : '#94a3b8'
                                }}
                            >
                                <Shield size={18} /> Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '1rem', marginTop: '1rem',
                            borderRadius: '16px', border: 'none',
                            background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                            color: 'white', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                {isEditing ? 'Save Changes' : 'Create User'}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
