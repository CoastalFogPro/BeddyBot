"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface StoryCardProps {
    id: string;
    title: string;
    imageUrl?: string | null;
    childName?: string | null;
    createdAt: string;
    onDelete?: (id: string) => void;
}

export default function StoryCard({ id, title, imageUrl, childName, onDelete }: StoryCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this story?')) return;

        if (onDelete) {
            setIsDeleting(true);
            await onDelete(id);
            setIsDeleting(false);
        }
    };

    if (isDeleting) return null; // Optimistic hide

    return (
        <div style={{ position: 'relative' }} className="group">
            <Link href={`/story/${id}`} style={{ textDecoration: 'none' }}>
                <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    style={{
                        width: '100%',
                        aspectRatio: '2/3', // Book aspect ratio
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : 'linear-gradient(45deg, #2b32b2, #1488cc)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3), 2px 0 5px rgba(0,0,0,0.2)', // Spine effect
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '1rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                        color: 'white'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                            {childName || 'BeddyBot'}
                        </div>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {title}
                        </h3>
                    </div>
                </motion.div>
            </Link>

            {onDelete && (
                <button
                    onClick={handleDelete}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        zIndex: 10,
                        backdropFilter: 'blur(4px)',
                        transition: 'opacity 0.2s',
                    }}
                    title="Delete Story"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );
}
