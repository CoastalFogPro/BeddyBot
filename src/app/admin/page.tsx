"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users, Shield, Plus,
    Search, Edit, Trash2, ShieldAlert, ArrowLeft
} from 'lucide-react';
import UserModal from '@/components/Admin/UserModal';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    subscriptionStatus?: string;
}

interface Stats {
    totalUsers: number;
    totalStories: number;
    activeSubscriptions: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setError] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/stats')
            ]);

            if (!usersRes.ok) {
                if (usersRes.status === 401) {
                    router.push('/dashboard');
                    return;
                }
                throw new Error('Failed to fetch users');
            }

            const userData = await usersRes.json();
            setUsers(userData);

            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

        } catch (err) {
            console.error(err);
            setError('Could not load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete the user and ALL their data (children, stories). This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            Loading Admin Panel...
        </div>
    );

    return (
        <main style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'var(--font-outfit)' }}>

            {/* Top Navigation */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>🤖</span> BeddyBot
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px' }}>
                    Admin Mode
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                    <div>
                        <Link href="/dashboard" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            color: '#94a3b8', textDecoration: 'none', marginBottom: '1rem',
                            fontSize: '0.9rem', fontWeight: '500'
                        }}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                padding: '12px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                                boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
                            }}>
                                <Shield color="white" size={32} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Master Admin</h1>
                                <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '1.1rem' }}>System Management</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        style={{
                            background: 'white', color: '#0f172a',
                            border: 'none', padding: '1rem 1.5rem', borderRadius: '16px',
                            fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            fontSize: '1rem'
                        }}
                    >
                        <div style={{ background: 'rgba(15, 23, 42, 0.1)', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                            <Plus size={20} />
                        </div>
                        Create New User
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem'
                }}>
                    {/* Stat Card 1: Users */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Total Users</p>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{stats?.totalUsers || 0}</h3>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#60a5fa' }}>
                                <Users size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2: Stories */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Stories Generated</p>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#facc15' }}>{stats?.totalStories || 0}</h3>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(250, 204, 21, 0.1)', borderRadius: '12px', color: '#facc15' }}>
                                <Shield size={24} /> {/* Placeholder icon */}
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 3: Active Subs */}
                    <div style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Active Premium</p>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#4ade80' }}>{stats?.activeSubscriptions || 0}</h3>
                            </div>
                            <div style={{ padding: '12px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px', color: '#4ade80' }}>
                                <ShieldAlert size={24} /> {/* Placeholder icon */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stripe Tools */}
                <div style={{
                    background: 'rgba(20, 20, 30, 0.6)',
                    border: '1px solid rgba(255, 100, 100, 0.2)',
                    borderRadius: '24px', padding: '1.5rem', marginBottom: '3rem'
                }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#fca5a5' }}>
                        ⚡ Emergency Stripe Tools
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                Stripe Customer ID (e.g. cus_TkX...)
                            </label>
                            <input
                                id="stripeToolsInput"
                                type="text"
                                placeholder="cus_..."
                                style={{
                                    width: '100%', padding: '0.75rem',
                                    background: 'black', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', color: 'white'
                                }}
                            />
                        </div>
                        <button
                            onClick={async () => {
                                const input = document.getElementById('stripeToolsInput') as HTMLInputElement;
                                const id = input.value.trim();
                                if (!id) return alert("Enter an ID");
                                if (!confirm(`Normally you should just click 'Cancel' in the Stripe Dashboard.\n\nAre you sure you want to FORCE CANCEL all subscriptions for ${id}?`)) return;

                                try {
                                    const res = await fetch('/api/admin/stripe-tool', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ customerId: id })
                                    });
                                    const data = await res.json();
                                    alert(JSON.stringify(data, null, 2));
                                } catch (e: any) {
                                    alert(e.message);
                                }
                            }}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '8px',
                                background: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Force Cancel
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px', overflow: 'hidden',
                    backdropFilter: 'blur(12px)'
                }}>

                    {/* Toolbar */}
                    <div style={{
                        padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Users color="#60a5fa" size={24} />
                            User Directory
                        </h2>

                        <div style={{ position: 'relative', minWidth: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem',
                                    background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px', color: 'white', fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>Joined</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '48px', height: '48px', borderRadius: '12px',
                                                    background: user.role === 'admin' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : '#334155',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: '700', fontSize: '1.2rem', color: 'white'
                                                }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>{user.name}</div>
                                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700',
                                                background: user.subscriptionStatus === 'active' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                                                color: user.subscriptionStatus === 'active' ? '#4ade80' : '#94a3b8',
                                            }}>
                                                {user.subscriptionStatus === 'active' ? 'PREMIUM' : 'FREE'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600',
                                                background: user.role === 'admin' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(51, 65, 85, 0.5)',
                                                color: user.role === 'admin' ? '#d8b4fe' : '#cbd5e1',
                                                border: user.role === 'admin' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(51, 65, 85, 0.5)',
                                                display: 'inline-flex', alignItems: 'center', gap: '6px'
                                            }}>
                                                {user.role === 'admin' && <Shield size={12} />}
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem', color: '#94a3b8' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <button
                                                        style={{
                                                            padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)',
                                                            color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center'
                                                        }}
                                                        title="View Details"
                                                    >
                                                        <Search size={18} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    style={{
                                                        padding: '8px', borderRadius: '8px', background: 'transparent',
                                                        color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    style={{
                                                        padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchData}
                />
            )}
        </main>
    );
}

const statCardStyle = {
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px', padding: '1.5rem',
    backdropFilter: 'blur(12px)'
};
