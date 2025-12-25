"use client";

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Play, Pause, Download, Share2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StoryView() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const [isPlaying, setIsPlaying] = useState(false);

    // Get inputs with fallbacks
    const name = searchParams.get('name') || 'James';
    const age = searchParams.get('age') || '5';
    const theme = searchParams.get('theme') || 'Adventure';
    const gender = searchParams.get('gender') || 'Boy';

    const [story, setStory] = useState({
        title: `${name}'s ${theme} Adventure`,
        content: ''
    });

    // State for generation status and dynamic assets
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    // Fetch Story and Image from API (with local fallback)
    useEffect(() => {
        const fetchContent = async () => {
            setIsGenerating(true);
            const ageNum = parseInt(age, 10);

            // 1. Generate Story
            try {
                const res = await fetch('/api/generate-story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, age, gender, theme })
                });

                if (res.ok) {
                    const data = await res.json();
                    setStory({ title: data.title, content: data.content });
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    if (errorData.code === 'SAFETY_VIOLATION') {
                        setStory({
                            title: 'Safety Shield Activated 🛡️',
                            content: "Oops! That theme is a bit too grown-up for BeddyBot. We want to keep stories magical and safe for everyone.\n\nLet's try something else? How about 'Flying Pancakes' or 'A Friendly Dragon'?"
                        });
                        // Stop generation here to avoid fallback
                        setIsGenerating(false);
                        return;
                    }
                    throw new Error('Story API failed');
                }
            } catch (error) {
                console.warn("Falling back to offline story generation");
                // FALLBACK LOGIC
                let generatedContent = '';
                let generatedTitle = '';
                if (ageNum < 3) {
                    generatedTitle = `${name}'s Gentle Rhyme`;
                    generatedContent = `Twinkle, twinkle, little star,\nHow I wonder what you are.\nUp above the ${theme} so high,\nLike a diamond in the sky.\n\nSleepy ${name} close your eyes,\nUnderneath the moonlit skies.\nDream of ${theme}s soft and sweet,\nRest your busy little feet.`;
                } else if (ageNum <= 7) {
                    generatedTitle = `${name} and the Magic ${theme}`;
                    generatedContent = `Once upon a time, in a land filled with colors and sparkles, lived a curious ${gender.toLowerCase()} named ${name}. Today was a special day because ${name} found a secret path leading to the Kingdom of ${theme}. "Wow!" whispered ${name}, seeing the friendly creatures dancing around.\n\nSuddenly, a tiny ${theme}-fairy flew over. "Hello ${name}! We've been waiting for you to join our parade!" ${name} laughed and clapped hands, marching along with the happy tune.\n\nIt was the most whimsical fun ever! As the sun began to set, the fairy sprinkled magic sleep-dust. "Goodnight, brave explorer," she chimed. And ${name} drifted off into a sweet, happy dream.`;
                } else {
                    generatedTitle = `The Chronicles of ${name}: The ${theme} Quest`;
                    generatedContent = `The ancient prophecy spoke of a hero named ${name}, who would one day unlock the secrets of the ${theme} Realm. That day had finally arrived. Equipped with nothing but courage and a trusty backpack, ${name} stepped through the shimmering portal.\n\nThe air smelled of ozone and mystery. A vast landscape stretched out before them, filled with floating islands and crystalline structures that hummed with energy. "Halt!" boomed a voice. A guardian of the ${theme}, standing ten feet tall and made of starlight, blocked the path. "Only the pure of heart may pass."\n\n${name} stood tall, looking the guardian in the eye. "I come to learn, not to conquer," ${name} said, solving the guardian's riddle with wisdom beyond their years. Impressed, the guardian bowed low. "Enter, young legend. The world needs your kindness."\n\nAfter a long journey of discovery, solving puzzles, and helping lost star-creatures find their way home, ${name} returned to the ordinary world, wiser and ready for tomorrow's challenges. As the stars aligned, our hero finally rested, knowing the universe was safe once more.`;
                }
                setStory({ title: generatedTitle, content: generatedContent });
            }

            // 2. Generate Image
            try {
                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme })
                });

                if (res.ok) {
                    const data = await res.json();
                    setBgImage(data.imageUrl);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    if (errorData.code === 'SAFETY_VIOLATION') {
                        // Special flag for safety violation image
                        setBgImage('SAFETY_BLOCKED');
                        return;
                    }
                    throw new Error('Image API failed');
                }
            } catch (error) {
                console.warn("Falling back to local images");
                // FALLBACK LOGIC
                const t = theme.toLowerCase();
                if (t.includes('space') || t.includes('star') || t.includes('planet')) setBgImage('/space-bg.png');
                else if (t.includes('forest') || t.includes('animal') || t.includes('magic')) setBgImage('/forest-bg.png');
                else setBgImage(null);
            }

            setIsGenerating(false);
        };

        fetchContent();
    }, [name, age, gender, theme]);

    // Voice State
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
            setVoices(available);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // Helper to find a specific gendered voice (heuristic based on common OS names)
    const getBestVoice = (gender: 'male' | 'female') => {
        const lowerGender = gender.toLowerCase();
        // Specific high-quality overrides
        const preferredNames = gender === 'male'
            ? ['Google US English Male', 'Daniel', 'Alex', 'David', 'Microsoft David']
            : ['Google US English Female', 'Samantha', 'Victoria', 'Zira', 'Microsoft Zira'];

        // 1. Try exact matches from preference list
        for (const name of preferredNames) {
            const match = voices.find(v => v.name.includes(name));
            if (match) return match;
        }

        // 2. Try to find voice with gender in name (if provided by browser)
        // Note: Standard Web Speech API doesn't have gender field, but name often contains it.
        const nameMatch = voices.find(v => v.name.toLowerCase().includes(lowerGender));
        if (nameMatch) return nameMatch;

        // 3. Fallback: just pick the first one if we can't find a match
        return voices[0] || null;
    };

    // Browser Native TTS
    const toggleAudio = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(story.content);
            const selectedVoice = getBestVoice(voiceGender);
            if (selectedVoice) utterance.voice = selectedVoice;

            utterance.rate = 0.9; // Slower, softer
            utterance.pitch = voiceGender === 'female' ? 1.1 : 0.9; // Higher for female, lower for male
            utterance.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            gap: '2rem'
        }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}>
                <Link href={`/create?name=${name}&age=${age}&gender=${gender}&theme=${theme}`} style={{ opacity: 0.8, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    ← Edit Details
                </Link>
                <Link href="/" style={{ fontWeight: '800', fontSize: '1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span> BeddyBot
                </Link>
            </nav>

            <div className="glass-panel" style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                backgroundColor: '#fff',
                color: '#1a2238',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>

                {/* Header */}
                <div className="text-center flex-col items-center gap-2">
                    <div style={{
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: 'var(--color-primary)',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}>
                        Bedtime Story #{String(id).slice(0, 4)}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1 }}>
                        {story.title}
                    </h1>
                </div>

                {/* Illustration */}
                <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '16px',
                    background: (bgImage && bgImage !== 'SAFETY_BLOCKED') ? `url(${bgImage}) center/cover no-repeat` : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.25rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    {bgImage === 'SAFETY_BLOCKED' ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛡️</div>
                            <p style={{ fontWeight: 'bold' }}>Safety Shield Active</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>(Image blocked for safety)</p>
                        </div>
                    ) : (
                        !bgImage && (
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    fontSize: '5rem',
                                    marginBottom: '1rem',
                                    animation: 'bounce 2s infinite ease-in-out'
                                }}>
                                    🤖
                                </div>
                                <p style={{ fontWeight: '500', fontSize: '1.2rem' }}>
                                    BeddyBot is painting your story...
                                </p>
                                <style jsx>{`
                                    @keyframes bounce {
                                        0%, 100% { transform: translateY(0); }
                                        50% { transform: translateY(-20px); }
                                    }
                                `}</style>
                            </div>
                        )
                    )}
                </div>

                {/* Audio Player Control Bar */}
                <div style={{
                    background: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                        <button
                            onClick={toggleAudio}
                            className="btn-primary"
                            style={{
                                padding: '0',
                                width: '48px', height: '48px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Narration ({isPlaying ? 'Playing...' : 'Ready'})</span>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                                    <button
                                        onClick={() => { window.speechSynthesis.cancel(); setIsPlaying(false); setVoiceGender('female'); }}
                                        style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '1rem',
                                            background: voiceGender === 'female' ? 'var(--color-primary)' : '#ddd',
                                            color: voiceGender === 'female' ? 'white' : '#666',
                                            border: 'none', cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                        👩 Female
                                    </button>
                                    <button
                                        onClick={() => { window.speechSynthesis.cancel(); setIsPlaying(false); setVoiceGender('male'); }}
                                        style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '1rem',
                                            background: voiceGender === 'male' ? 'var(--color-primary)' : '#ddd',
                                            color: voiceGender === 'male' ? 'white' : '#666',
                                            border: 'none', cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                        👨 Male
                                    </button>
                                </div>
                            </div>
                            <div style={{ height: '6px', width: '100%', background: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: isPlaying ? '100%' : '0%',
                                    background: 'var(--color-primary)',
                                    transition: isPlaying ? 'width 20s linear' : 'width 0.2s',
                                    animation: isPlaying ? 'progress 20s linear' : 'none'
                                }}></div>
                            </div>
                        </div>

                        <button style={{ padding: '0.5rem', opacity: 0.6 }}><Download size={20} /></button>
                    </div>
                </div>

                {/* Story Text */}
                <div style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    fontFamily: 'Georgia, serif',
                    color: '#333'
                }}>
                    {story.content.split('\n').map((paragraph: string, i: number) => (
                        paragraph.trim() && <p key={i} style={{ marginBottom: '1.25rem' }}>{paragraph}</p>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                    <button className="btn-base" style={{ background: '#f3f4f6', flex: 1, color: '#333' }}>
                        <Share2 size={18} /> Share
                    </button>
                    <button className="btn-base" style={{ background: '#f3f4f6', flex: 1, color: '#333' }}>
                        <BookOpen size={18} /> Save to Library
                    </button>
                </div>

            </div>
        </main>
    );
}
