"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Shield, CreditCard, Calendar, BookOpen, Trash2 } from 'lucide-react';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                if (!res.ok) throw new Error('Failed to fetch details');
                setData(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleDeleteStory = async (storyId: string) => {
        if (!confirm("Delete this story?")) return;
        try {
            await fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
            setData((prev: any) => ({
                ...prev,
                stories: prev.stories.filter((s: any) => s.id !== storyId)
            }));
        } catch (e) {
            alert('Failed to delete story');
        }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            Loading Details...
        </div>
    );

    if (!data) return <div>User not found</div>;

    const { user, children, stories } = data;

    return (
        <main style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem' }}>

            {/* Nav */}
            <div style={{ maxWidth: '1000px', margin: '0 auto 2rem' }}>
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none' }}>
                    <ArrowLeft size={18} /> Back to Users
                </Link>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>

                {/* Left Column: User Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(12px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 'bold'
                            }}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{user.name}</h1>
                                <p style={{ color: '#94a3b8', margin: 0 }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <InfoRow icon={<Shield size={18} />} label="Role" value={user.role} />
                            <InfoRow icon={<CreditCard size={18} />} label="Plan" value={user.subscriptionStatus === 'active' ? 'Premium' : 'Free'} />
                            <InfoRow icon={<Calendar size={18} />} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                            <InfoRow icon={<BookOpen size={18} />} label="Stories" value={stories.length} />
                        </div>
                    </div>

                    {/* Children */}
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(12px)'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Children Profiles</h3>
                        {children.length === 0 ? <p style={{ opacity: 0.5 }}>No profiles created.</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {children.map((child: any) => (
                                    <div key={child.id} style={{
                                        background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{child.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{child.age} years • {child.gender}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Stories */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(12px)',
                    height: 'fit-content'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Story History</h2>

                    {stories.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                            No stories generated yet.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {stories.map((story: any) => (
                                <div key={story.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '1.5rem', borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {story.imageUrl ? (
                                            <img src={story.imageUrl} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }} />
                                        )}
                                        <div>
                                            <Link href={`/story/${story.id}`} target="_blank" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>
                                                {story.title}
                                            </Link>
                                            <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '4px' }}>
                                                {story.theme} • {new Date(story.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteStory(story.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)', color: '#f87171',
                                            border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer'
                                        }}
                                        title="Delete Story"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </main>
    )
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string | number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#94a3b8' }}>
                {icon}
                <span>{label}</span>
            </div>
            <span style={{ fontWeight: '600' }}>{value}</span>
        </div>
    );
}
