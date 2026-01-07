'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function ScrollReveal({
    children,
    className = "",
    style = {},
    delay = 0
}: {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
