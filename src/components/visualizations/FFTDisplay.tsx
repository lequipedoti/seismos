'use client';

import { useEffect, useRef } from 'react';
import { useSeismosStore } from '@/lib/store';

interface FFTDisplayProps {
    nodeId: string;
    width?: number;
    height?: number;
}

export default function FFTDisplay({ nodeId, width = 300, height = 150 }: FFTDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const { latestReadings } = useSeismosStore();

    // Mock FFT data generation since we don't have actual raw audio-like samples in bursts
    // We'll simulate frequency shifts based on the Z-axis magnitude
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let bars: number[] = new Array(32).fill(0);

        const draw = () => {
            const reading = latestReadings.get(nodeId);
            const intensity = reading ? Math.min(reading.magnitude / 2, 1) : 0;

            // Update bars with some randomness + intensity modulation
            bars = bars.map((prev, i) => {
                // Higher frequencies (higher i) react more to intensity
                const jitter = Math.random() * 0.2;
                let target = Math.random() * 0.3; // Base noise

                if (reading) {
                    // Create spectral shape based on intensity
                    const center = 8 + intensity * 16; // Peak moves with intensity
                    const dist = Math.abs(i - center);
                    const signal = Math.exp(-dist * dist / 20) * intensity;
                    target += signal;
                }

                return prev * 0.8 + target * 0.2; // Smooth transition
            });

            // Clear
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            // Draw bars
            const barWidth = width / bars.length;
            const gap = 2;

            bars.forEach((val, i) => {
                const barHeight = val * height * 0.8;
                const x = i * barWidth;
                const y = height - barHeight;

                // Gradient fill
                const gradient = ctx.createLinearGradient(x, y, x, height);
                gradient.addColorStop(0, '#06b6d4');   // Cyan top
                gradient.addColorStop(1, '#3b82f6');   // Blue bottom

                // High magnitude warning color
                if (val > 0.8) {
                    gradient.addColorStop(0, '#ef4444'); // Red top for peaks
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth - gap, barHeight);

                // Reflection effect
                ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
                ctx.fillRect(x, height, barWidth - gap, barHeight * 0.3);
            });

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
        };
    }, [nodeId, latestReadings, width, height]);

    return (
        <div className="relative rounded bg-black/5 border border-border p-2">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-600/50">
                FREKANS SPEKTRUMU (Hz)
            </div>
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    );
}
