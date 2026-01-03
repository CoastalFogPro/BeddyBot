"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import AdminLink from '@/components/AdminLink';
import ProfileCard from '@/components/Dashboard/ProfileCard';
import StoryCard from '@/components/Dashboard/StoryCard';
import AddChildModal from '@/components/Dashboard/AddChildModal';
import { Plus, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

import UsageIndicator from '@/components/Dashboard/UsageIndicator';

interface Child {
    id: string;
    name: string;
    age: string;
    gender: string;
}

export default function Dashboard() {
    const [children, setChildren] = useState<Child[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [userStatus, setUserStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [childRes, storyRes, statusRes] = await Promise.all([
                fetch('/api/children'),
                fetch('/api/stories'),
                fetch('/api/user/status')
            ]);

            if (childRes.ok) setChildren(await childRes.json());
            if (storyRes.ok) setStories(await storyRes.json());
            if (statusRes.ok) setUserStatus(await statusRes.json());

        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStory = async (storyId: string) => {
        try {
            const res = await fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
            if (res.ok) {
                // Remove from local state immediately for speed
                setStories((prev: any[]) => prev.filter((s: any) => s.id !== storyId));
                // Update count locally to reflect change immediately
                if (userStatus) {
                    setUserStatus((prev: any) => ({ ...prev, storyCount: Math.max(0, prev.storyCount - 1) }));
                }
            } else {
                alert("Failed to delete story.");
            }
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    useEffect(() => {
        fetchData();

        // Check for checkout success
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            fetch('/api/stripe/sync', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    console.log("Auto-Synced Subscription:", data);
                    // Re-fetch user status after sync
                    fetch('/api/user/status')
                        .then(r => r.json())
                        .then(status => setUserStatus(status));
                })
                .catch(err => console.error("Sync failed", err));
        }
    }, []);

    return (
        <main style={{ minHeight: '100vh', background: '#0f172a', color: 'white', paddingBottom: '4rem' }}>

            {/* Top Navigation */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>🤖</span> BeddyBot
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/subscription" className="hover:text-blue-400 transition-colors">
                        Membership
                    </Link>
                    <AdminLink />
                    <LogoutButton />
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

                {/* Usage Indicator */}
                {userStatus && (
                    <UsageIndicator
                        isPremium={userStatus.isPremium}
                        count={userStatus.storyCount}
                        limit={userStatus.limit}
                    />
                )}

                {/* Hero Greeting */}
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Who is listening tonight?
                    </h1>
                    <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>
                        Select a profile to start a new adventure or visit their library.
                    </p>
                </header>

                {/* Children Grid */}
                <section style={{ marginBottom: '4rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '2rem',
                        alignItems: 'start'
                    }}>
                        {/* Add New Button */}
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                aspectRatio: '0.8',
                                borderRadius: '24px',
                                border: '3px dashed rgba(255,255,255,0.2)',
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.5)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                gap: '1rem'
                            }}
                        >
                            <div style={{
                                width: '60px', height: '60px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Plus size={32} />
                            </div>
                            New Profile
                        </motion.button>

                        {/* Existing Profiles */}
                        {children.map(child => (
                            <Link href={`/create?childId=${child.id}`} key={child.id} style={{ textDecoration: 'none' }}>
                                <ProfileCard
                                    name={child.name}
                                    age={child.age}
                                    gender={child.gender}
                                />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Library Section */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Recent Magic</h2>
                        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {stories.length === 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '24px',
                            padding: '3rem',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ opacity: 0.5, marginBottom: '1rem' }}>
                                <BookOpen size={48} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Your Library is Empty</h3>
                            <p style={{ opacity: 0.6 }}>Create a profile and launch a story to fill your bookshelf!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '2rem'
                        }}>
                            {stories.map(story => (
                                <StoryCard
                                    key={story.id}
                                    id={story.id}
                                    title={story.title}
                                    imageUrl={story.imageUrl}
                                    childName={story.childName}
                                    createdAt={story.createdAt}
                                    onDelete={handleDeleteStory}
                                />
                            ))}
                        </div>
                    )}
                </section>

            </div>

            <AddChildModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchData(); // Refresh list
                }}
            />
        </main >
    );
}
