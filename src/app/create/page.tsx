import StoryForm from '@/components/Story/StoryForm';
import Link from 'next/link';
import { db } from '@/db';
import { children, stories, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function CreatePage(props: { searchParams: Promise<{ childId?: string }> }) {
    const session = await auth();
    const searchParams = await props.searchParams;
    let initialData = undefined;

    if (!session?.user?.id) return (<div>Unauthorized</div>);

    // --- SUBSCRIPTION CHECK ---
    // 1. Get User Status
    const [dbUser] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    // 2. Count Stories
    const userStories = await db.select({ id: stories.id }).from(stories).where(eq(stories.userId, session.user.id));
    const storyCount = userStories.length;

    // 3. Define Limits
    const isPremium = dbUser?.subscriptionStatus === 'active';
    const isAdmin = dbUser?.role === 'admin';
    const limit = isAdmin ? 999999 : (isPremium ? 30 : 1);

    // 4. Redirect if Limit Reached
    // 4. Show Locked View if Limit Reached
    if (storyCount >= limit) {
        return (
            <main style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: 'white',
                background: '#0f172a'
            }}>
                <div style={{
                    maxWidth: '500px',
                    textAlign: 'center',
                    background: 'rgba(30, 41, 59, 0.5)',
                    padding: '3rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔒</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Story Time Is Over... For Now!
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2rem', lineHeight: '1.6' }}>
                        You've used up your free story. Don't worry, the magic doesn't have to end here. Unlock unlimited adventures right now.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/dashboard/subscription" style={{ textDecoration: 'none' }}>
                            <button style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                            }}>
                                Unlock Unlimited Stories
                            </button>
                        </Link>

                        <Link href="/dashboard" style={{
                            color: '#94a3b8',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            Back to Library
                        </Link>
                    </div>
                </div>
            </main>
        );
    }
    // --------------------------

    if (searchParams?.childId) {
        // Fetch Child Details
        const [child] = await db.select()
            .from(children)
            .where(and(
                eq(children.id, searchParams.childId),
                eq(children.userId, session.user.id)
            )); // Ensure ownership

        if (child) {
            initialData = {
                childId: child.id,
                name: child.name,
                age: child.age,
                gender: child.gender
            };
        }
    }

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
        }}>

            <Link href={initialData ? "/dashboard" : "/"} style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                opacity: 0.7,
                fontWeight: '600'
            }}>
                ← Back
            </Link>

            <div style={{
                textAlign: 'center',
                marginBottom: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{ fontSize: '3rem', animation: 'float 3s ease-in-out infinite' }}>🤖</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                        Beddy<span style={{ color: 'var(--color-primary)' }}>Bot</span>
                    </h2>
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
                    {initialData ? `Story for ${initialData.name}` : 'Create a Bedtime Story'}
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '500px' }}>
                    Create a magical bedtime story just for your child—with a little help from BeddyBot!
                </p>
            </div>

            <StoryForm initialData={initialData} />

        </main>
    );
}
