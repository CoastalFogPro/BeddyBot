import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';

interface UsageIndicatorProps {
    isPremium: boolean;
    count: number;
    limit: number;
    savedCount?: number;
    savedLimit?: number;
}

export default function UsageIndicator({ isPremium, count, limit, savedCount, savedLimit }: UsageIndicatorProps) {
    const percentage = Math.min((count / limit) * 100, 100);
    const isNearLimit = percentage >= 80;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap'
        }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                        {isPremium ? 'Premium Plan Active' : 'Starter Plan'}
                    </div>
                    {isPremium && (
                        <span style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                            color: 'black',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            fontWeight: '800'
                        }}>
                            PRO
                        </span>
                    )}
                </div>

                <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                    <strong>{count}</strong> / <strong>{limit}</strong> Stories Generated This Month
                </div>
                {savedLimit && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem' }}>
                        (Library: {savedCount} / {savedLimit} stories saved)
                    </div>
                )}

                {/* Progress Bar */}
                <div style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            background: isNearLimit ? '#ef4444' : '#10b981',
                            borderRadius: '4px'
                        }}
                    />
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                {!isPremium && (
                    <Link href="/dashboard/subscription" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            <Zap size={18} fill="white" /> Upgrade to Unlimited
                        </motion.button>
                    </Link>
                )}
                {isPremium && isNearLimit && (
                    <div style={{ color: '#ef4444', fontWeight: '600' }}>Running low on magic?</div>
                )}
            </div>
        </div>
    );
}
