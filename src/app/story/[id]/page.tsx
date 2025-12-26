"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Pause, Save, ArrowLeft, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryView() {
    const params = useParams();
    const id = params?.id as string;
    const searchParams = useSearchParams();
    const router = useRouter();

    // Determine if we are viewing a saved story or generating a new one
    // "123" is our placeholder ID for new generations from the form
    const isGeneratingNew = id === '123';

    // State for Story Content
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [theme, setTheme] = useState('');

    // State for UI
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioLoading, setAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleAudio = async () => {
        if (audioLoading) return;

        // If audio is already playing, pause it
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // If audio is paused but exists, resume it
        if (!isPlaying && audioRef.current) {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (e) {
                console.error("Resume failed", e);
            }
            return;
        }

        // If no audio exists, fetch it
        setAudioLoading(true);
        try {
            // Combine title and content for full narration
            const fullText = title + ". \n\n" + content.join('\n\n');

            const res = await fetch('/api/audio/speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: fullText }),
            });

            if (!res.ok) throw new Error('Failed to generate audio');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => setIsPlaying(false);
            // We handle pause manually to avoid state flickers, but good to have safety
            audio.onpause = () => setIsPlaying(false);
            audio.onplay = () => setIsPlaying(true);

            try {
                await audio.play();
                setIsPlaying(true);
            } catch (playError: any) {
                console.warn("Autoplay blocked, waiting for user interaction", playError);
                setIsPlaying(false);
                // If it's a NotAllowedError, we just stop. The user will see the Play button and click it again.
                // This second click will work because it's a direct interaction with the existing audio element.
                if (playError.name !== 'NotAllowedError') {
                    alert("Could not play audio. Please try again.");
                }
            }

        } catch (error: any) {
            console.error("Audio generation failed", error);
            alert(`Sorry, I couldn't read the story right now. Error: ${error.message}`);
        } finally {
            setAudioLoading(false);
        }
    };
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Params for Generation (only relevant if isGeneratingNew)
    const childId = searchParams.get('childId');
    const childName = searchParams.get('name') || 'James';
    const childAge = searchParams.get('age') || '5';
    const childGender = searchParams.get('gender') || 'Boy';
    const requestedTheme = searchParams.get('theme') || 'Space Adventure';

    // Flag to prevent double-firing in Strict Mode
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        // If we already fetched/generated, or if we have missing params, stop.
        if (hasFetchedRef.current) return;

        const loadStory = async () => {
            hasFetchedRef.current = true; // Mark as started immediately
            setIsLoading(true);

            if (isGeneratingNew) {
                // --- GENERATION MODE ---
                try {
                    console.log("Generating story & image for:", { childName, requestedTheme });

                    // Run Story and Image generation in parallel
                    const [storyRes, imageRes] = await Promise.all([
                        fetch('/api/generate-story', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: childName,
                                age: childAge,
                                gender: childGender,
                                theme: requestedTheme
                            })
                        }),
                        fetch('/api/generate-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ theme: requestedTheme })
                        })
                    ]);

                    if (!storyRes.ok) {
                        const errData = await storyRes.json().catch(() => ({}));
                        throw new Error(errData.error || "Story generation failed");
                    }

                    const storyData = await storyRes.json();
                    setTitle(storyData.title);
                    // Ensure content is array
                    const contentArray = Array.isArray(storyData.content) ? storyData.content : storyData.content.split('\n\n');
                    setContent(contentArray);
                    setTheme(requestedTheme);

                    // Handle Image Result
                    if (imageRes.ok) {
                        const imageData = await imageRes.json();
                        setImageUrl(imageData.imageUrl);
                    } else {
                        console.warn("Image generation failed");
                        setImageUrl(''); // Fallback or keep empty
                    }

                } catch (error: any) {
                    console.error("Error generating content:", error);
                    setTitle("Oh no!");

                    // Show specific error if it's about the API key
                    if (error.message?.includes('API Key')) {
                        setContent(["It looks like the magic keys (API Keys) are missing on the server. Please check your Netlify settings!"]);
                    } else {
                        setContent(["The story machine needs a nap. Please try again later!"]);
                    }
                }
            } else {
                // --- VIEW MODE (Saved Story) ---
                try {
                    console.log("Fetching saved story:", id);
                    const res = await fetch(`/api/stories/${id}`);

                    if (res.ok) {
                        const data = await res.json();
                        setTitle(data.title);
                        // Content likely stored as single string in DB, split it back
                        const contentData = data.content || "";
                        setContent(contentData.split('\n\n'));
                        setImageUrl(data.imageUrl);
                        setTheme(data.theme);
                        setIsSaved(true); // It's already saved
                    } else {
                        throw new Error("Story not found");
                    }
                } catch (error) {
                    console.error("Error fetching story:", error);
                    setTitle("Story not found");
                    setContent(["We couldn't find this story in your library."]);
                }
            }

            setIsLoading(false);
        };

        loadStory();
    }, [id, isGeneratingNew, childName, childAge, childGender, requestedTheme]);


    const handleManualSave = async () => {
        if (!childId || isSaved || isSaving) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/stories/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    childId,
                    title,
                    content: content.join('\n\n'),
                    imageUrl,
                    theme
                })
            });

            if (res.ok) {
                setIsSaved(true);
                // Optional: Could redirect to the new canonical URL, but staying here is fine
            }
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', color: 'white', background: '#0f172a' }}>
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: '4rem' }}
                >
                    ✨
                </motion.div>
                <motion.h2
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '1px' }}
                >
                    {isGeneratingNew ? 'Weaving your magical story...' : 'Opening the book...'}
                </motion.h2>
            </div>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: '#0f172a', paddingBottom: '4rem' }}>

            {/* Top Bar */}
            <nav style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                    <ArrowLeft size={24} /> Dashboard
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '2rem' }}>🤖</div>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'white' }}>
                        BeddyBot
                    </span>
                </div>


            </nav>

            {/* Story Container (The Book Page) */}
            <article style={{
                maxWidth: '800px',
                margin: '1rem auto',
                background: '#fffcf5', // Cream paper
                color: '#2d3436', // Ink color
                borderRadius: '12px', // Soft pages
                boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>

                {/* Image Cover */}
                {imageUrl && (
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        position: 'relative',
                        background: '#eee'
                    }}>
                        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                )}

                <div style={{ padding: '3rem 4rem' }}>
                    {/* Title */}
                    <header style={{ textAlign: 'center', marginBottom: '2.5rem', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '2rem' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(79, 70, 229, 0.1)',
                            color: '#4f46e5',
                            padding: '0.4rem 1rem',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: '600',
                            marginBottom: '1rem'
                        }}>
                            {theme || 'Magical Story'}
                        </div>

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontFamily: 'serif',
                            fontWeight: '800',
                            lineHeight: 1.2,
                            marginBottom: '0.5rem',
                            color: '#1a202c',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
                        }}>
                            {title}
                            <button
                                onClick={toggleAudio}
                                disabled={audioLoading}
                                style={{
                                    background: audioLoading ? '#cbd5e1' : '#4f46e5',
                                    color: audioLoading ? '#64748b' : 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    padding: '0.8rem 1.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    cursor: audioLoading ? 'wait' : 'pointer',
                                    boxShadow: audioLoading ? 'none' : '0 4px 15px rgba(79, 70, 229, 0.4)',
                                    transition: 'all 0.2s',
                                    fontSize: '1rem', fontWeight: '600'
                                }}
                            >
                                {audioLoading ? (
                                    <>
                                        <div style={{
                                            width: '16px', height: '16px',
                                            border: '2px solid #64748b',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                        <span>Preparing...</span>
                                    </>
                                ) : isPlaying ? (
                                    <>
                                        <Pause size={20} fill="white" />
                                        <span>Pause</span>
                                    </>
                                ) : audioUrl ? (
                                    <>
                                        <Play size={20} fill="white" />
                                        <span>Tap to Start</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} fill="white" />
                                        <span>Read to Me</span>
                                    </>
                                )}
                            </button>
                        </h1>
                        <style jsx>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </header>

                    {/* Text Content */}
                    <div style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.9',
                        fontFamily: 'Georgia, serif',
                        textAlign: 'left'
                    }}>
                        {content.map((paragraph, idx) => (
                            <motion.p
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                style={{ marginBottom: '1.5rem' }}
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>

                    {/* Actions: Save Button */}
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center' }}>
                        {isGeneratingNew && childId && (
                            <button
                                onClick={handleManualSave}
                                disabled={isSaved || isSaving}
                                className="btn-primary"
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    opacity: isSaved ? 0.8 : 1,
                                    cursor: isSaved ? 'default' : 'pointer',
                                    background: isSaved ? '#10B981' : undefined,
                                    borderColor: isSaved ? '#10B981' : undefined
                                }}
                            >
                                {isSaving ? (
                                    'Saving...'
                                ) : isSaved ? (
                                    <>Saved to Library <BookOpen size={20} /></>
                                ) : (
                                    <>Save Story <Save size={20} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </article>
        </main>
    );
}
