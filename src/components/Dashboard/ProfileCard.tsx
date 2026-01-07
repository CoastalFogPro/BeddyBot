"use client";

import { motion } from 'framer-motion';
import { User, Sparkles, Rocket, Trash2, Edit2 } from 'lucide-react';

interface ProfileCardProps {
    name: string;
    age: string;
    gender: 'Boy' | 'Girl' | string;
    isSelected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
}

export default function ProfileCard({ name, age, gender, isSelected, onClick, onDelete, onEdit }: ProfileCardProps) {
    // Theme logic
    const isGirl = gender === 'Girl';

    // Gradients
    const bgGradient = isGirl
        ? 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)'
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';

    const shadowColor = isGirl ? 'rgba(255, 154, 158, 0.5)' : 'rgba(79, 172, 254, 0.5)';
    const Icon = isGirl ? Sparkles : Rocket;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                background: bgGradient,
                borderRadius: '24px',
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 15px 30px -5px ${shadowColor}`,
                width: '100%',
                aspectRatio: '0.8', // Portrait card shape
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isSelected ? '4px solid white' : 'none',
            }}
        >
            {/* Background Pattern Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.4) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            {/* Icon Header */}
            <div style={{
                background: 'rgba(255,255,255,0.3)',
                width: '48px', height: '48px',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(5px)'
            }}>
                <Icon size={24} color="white" strokeWidth={2.5} />
            </div>

            {/* Action Buttons (Edit & Delete) */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
                {/* Edit Button */}
                {onEdit && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onEdit();
                        }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <Edit2 size={18} color="white" />
                    </div>
                )}

                {/* Delete Button */}
                {onDelete && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDelete();
                        }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.2)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Trash2 size={18} color="white" />
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div style={{ color: 'white', zIndex: 2 }}>
                <h3 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    marginBottom: '0.25rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {name}
                </h3>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.9,
                    fontWeight: 600
                }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85rem'
                    }}>
                        {age} Years Old
                    </span>
                </div>
            </div>

            {/* Floating Decoration */}
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                opacity: 0.2,
                transform: 'rotate(-15deg)'
            }}>
                <Icon size={120} color="white" />
            </div>

        </motion.div>
    );
}
