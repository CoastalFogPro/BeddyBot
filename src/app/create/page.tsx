import StoryForm from '@/components/Story/StoryForm';
import Link from 'next/link';

export default function CreatePage() {
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

            <Link href="/" style={{
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
                {/* Mocking the header logo + beddybot text */}
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
                    Create a Bedtime Story
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '500px' }}>
                    Create a magical bedtime story just for your child—with a little help from BeddyBot!
                </p>
            </div>

            <StoryForm />

        </main>
    );
}
