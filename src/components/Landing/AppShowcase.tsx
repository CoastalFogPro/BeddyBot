"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UserPlus, Sparkles, BookOpen } from 'lucide-react';

const features = [
    {
        id: 'dashboard',
        title: 'Your Family Kingdom',
        description: 'A magical dashboard to manage your child\'s profiles and favorite stories.',
        icon: LayoutDashboard,
        image: '/mockup-dashboard.png',
        color: '#4D96FF'
    },
    {
        id: 'profiles',
        title: 'Create Personal Profiles',
        description: 'Set the perfect age and name settings to tailor every adventure.',
        icon: UserPlus,
        image: '/mockup-profile.png',
        color: '#6BCB77'
    },
    {
        id: 'create',
        title: 'Simple Personalization',
        description: 'Just pick a theme, and watch our AI weave a unique tale in seconds.',
        icon: Sparkles,
        image: '/mockup-create.png',
        color: '#FFD700'
    },
    {
        id: 'story',
        title: 'Beautiful Adventures',
        description: 'Read along with illustrated pages or listen to the soothing narration.',
        icon: BookOpen,
        image: '/mockup-story.png',
        color: '#FF9F43'
    }
];

export default function AppShowcase() {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <div style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '3rem',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            {/* Left Side: Navigation / Text */}
            <div style={{
                flex: '1 1 400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {features.map((feature, index) => {
                    const isActive = activeFeature === index;
                    const Icon = feature.icon;

                    return (
                        <div
                            key={feature.id}
                            onClick={() => setActiveFeature(index)}
                            style={{
                                position: 'relative',
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: isActive ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: '4px',
                                        borderTopLeftRadius: '1rem',
                                        borderBottomLeftRadius: '1rem',
                                        backgroundColor: feature.color
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{
                                    minWidth: '3rem',
                                    height: '3rem',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.3s',
                                    backgroundColor: isActive ? feature.color : 'rgba(255,255,255,0.05)',
                                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)'
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem',
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                        transition: 'color 0.3s'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                                        margin: 0,
                                        transition: 'color 0.3s'
                                    }}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right Side: Image Display */}
            <div style={{
                flex: '1 1 400px',
                height: '600px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    filter: 'blur(60px)',
                    opacity: 0.3,
                    transition: 'background 0.7s',
                    background: `radial-gradient(circle, ${features[activeFeature].color}, transparent 70%)`
                }} />

                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '340px', // Restrict width to look like a phone/tablet
                    aspectRatio: '9/16',
                    perspective: '1000px'
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFeature}
                            initial={{ opacity: 0, x: 50, rotateY: 10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -50, rotateY: -10 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                inset: 0
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                borderRadius: '2.5rem',
                                overflow: 'hidden',
                                border: '8px solid #1a1a1a',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                background: '#1a1a1a'
                            }}>
                                <Image
                                    src={features[activeFeature].image}
                                    alt={features[activeFeature].title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    quality={90}
                                    priority
                                />
                                {/* Glass Reflection overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top right, rgba(255,255,255,0.05), transparent)',
                                    pointerEvents: 'none'
                                }} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
