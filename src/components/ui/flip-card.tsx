'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FlipCardProps {
    front: React.ReactNode;
    back: React.ReactNode;
    className?: string;
}

export function FlipCard({ front, back, className }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    function handleFlip() {
        if (!isAnimating) {
            setIsFlipped((prev) => !prev);
            setIsAnimating(true);
        }
    }

    return (
        <div
            className={cn("group h-40 w-full perspective-1000 cursor-pointer", className)}
            onMouseEnter={() => !isFlipped && setIsFlipped(true)}
            onMouseLeave={() => isFlipped && setIsFlipped(false)}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setIsAnimating(false)}
                className="relative h-full w-full preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div className="absolute h-full w-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    {front}
                </div>

                {/* Back */}
                <div
                    className="absolute h-full w-full backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {back}
                </div>
            </motion.div>
        </div>
    );
}
