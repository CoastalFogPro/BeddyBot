"use client";

import { useState } from 'react';
import { X, Save, Trash2, Shield, User } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {isEditing ? 'Edit User' : 'Create New User'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            {isEditing ? 'New Password (Leave blank to keep)' : 'Password'}
                        </label>
                        <input
                            type="password"
                            required={!isEditing}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.role === 'user'
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-slate-800 border-white/10 text-gray-400 hover:bg-slate-700'
                                    }`}
                            >
                                <User size={18} /> User
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                                className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.role === 'admin'
                                        ? 'bg-purple-600 border-purple-500 text-white'
                                        : 'bg-slate-800 border-white/10 text-gray-400 hover:bg-slate-700'
                                    }`}
                            >
                                <Shield size={18} /> Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 rounded-xl font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
