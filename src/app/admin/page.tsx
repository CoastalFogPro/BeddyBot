"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users, Shield, Plus, MoreVertical,
    Search, Edit, Trash2, ShieldAlert, ArrowLeft
} from 'lucide-react';
import UserModal from '@/components/Admin/UserModal';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/dashboard'); // Not admin
                    return;
                }
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError('Could not load user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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

    if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading Admin Panel...</div>;

    return (
        <main className="min-h-screen bg-[#0f172a] text-white p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30">
                                <Shield className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    Master Admin
                                </h1>
                                <p className="text-gray-400 mt-1 text-lg">System Overview & User Management</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="bg-white text-slate-900 hover:bg-gray-100 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="bg-slate-900/10 p-1 rounded-full">
                            <Plus size={20} />
                        </div>
                        Create New User
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 font-medium mb-2">Total Users</p>
                            <h3 className="text-5xl font-bold tracking-tight text-white">{users.length}</h3>
                            <div className="mt-4 inline-flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Active Database
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 font-medium mb-2">Administrators</p>
                            <h3 className="text-5xl font-bold tracking-tight text-purple-400">{users.filter(u => u.role === 'admin').length}</h3>
                            <div className="mt-4 inline-flex items-center gap-2 text-sm text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">
                                <Shield size={12} />
                                System Control
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                        <h4 className="text-gray-400 font-medium mb-2">Quick Actions</h4>
                        <div className="text-sm text-gray-500">More analytics coming soon</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users className="text-blue-400" size={24} />
                            User Directory
                        </h2>

                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-6">User Details</th>
                                    <th className="p-6">Access Level</th>
                                    <th className="p-6">Joined Date</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ${user.role === 'admin'
                                                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                                                        : 'bg-gradient-to-br from-slate-700 to-slate-600 text-gray-200'
                                                    }`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">{user.name}</div>
                                                    <div className="text-sm text-gray-400 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                                    : 'bg-slate-700/30 text-slate-300 border-slate-600/30'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} />}
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-6 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-500 hover:text-white text-gray-400 transition-all shadow-lg hover:shadow-blue-500/20"
                                                    title="Edit User"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500 hover:text-white text-gray-400 transition-all shadow-lg hover:shadow-red-500/20"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-500">
                                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-lg">No users found matching "{searchTerm}"</p>
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="text-blue-400 hover:underline"
                                                >
                                                    Clear filter
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchUsers}
                />
            )}
        </main>
    );
}
