"use client";

import { useState, useRef } from 'react';
import { Play, Pause, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryDemoProps {
    title: string;
    content: string;
    imageUrl: string;
    audioUrl: string;
    childName: string;
}

export default function StoryDemo({ title, content, imageUrl, audioUrl, childName }: StoryDemoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section style={{
            padding: '2rem 1rem 6rem 1rem', // Extended bottom padding
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}>

            <div style={{
                textAlign: 'center',
                marginBottom: '4rem',
                maxWidth: '800px',
                zIndex: 2
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Experience the Magic
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
                    Listen to a real story generated for <strong>{childName}</strong>.
                </p>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3rem',
                maxWidth: '1200px',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2
            }}>
                {/* 1. Book Cover / Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        flex: '1 1 400px',
                        maxWidth: '500px',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        aspectRatio: '1/1',
                        position: 'relative'
                    }}>
                        <img
                            src={imageUrl}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Play Overlay */}
                        <div
                            onClick={togglePlay}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            className="play-overlay"
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.4)',
                                transition: 'transform 0.2s'
                            }}>
                                {isPlaying ?
                                    <Pause size={32} fill="white" stroke="white" /> :
                                    <Play size={32} fill="white" stroke="white" style={{ marginLeft: '4px' }} />
                                }
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Story Content & Player */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        flex: '1 1 400px',
                        maxWidth: '500px',
                        color: 'white'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <span style={{
                            background: '#3b82f6',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                        }}>Demo Story</span>

                    </div>

                    <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                        {title}
                    </h3>

                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: '2rem'
                    }}>
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: '#cbd5e1',
                            fontStyle: 'italic',
                            marginBottom: '1rem'
                        }}>
                            "{content.length > 300 ? content.substring(0, 300) + '...' : content}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
                            <BookOpen size={16} />
                            <span>Read by our soothing BeddyBot narrator</span>
                        </div>
                    </div>

                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        style={{ width: '100%', height: '40px', borderRadius: '10px' }}
                        controls
                    />
                </motion.div>
            </div>
        </section>
    );
}
