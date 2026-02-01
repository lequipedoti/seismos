'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSeismosStore } from '@/lib/store';

interface OscilloscopeProps {
    nodeId: string;
    width?: number;
    height?: number;
}

const AXIS_COLORS = {
    x: '#ef4444', // Red
    y: '#22c55e', // Green
    z: '#3b82f6', // Blue
};

const BUFFER_SIZE = 200;

export default function Oscilloscope({ nodeId, width = 400, height = 200 }: OscilloscopeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const bufferRef = useRef<{ x: number[]; y: number[]; z: number[] }>({
        x: [],
        y: [],
        z: [],
    });

    const { readings } = useSeismosStore();
    const nodeReadings = readings.get(nodeId) || [];

    // Update buffer with new readings
    useEffect(() => {
        nodeReadings.slice(-BUFFER_SIZE).forEach((reading) => {
            bufferRef.current.x.push(reading.accel_x);
            bufferRef.current.y.push(reading.accel_y);
            bufferRef.current.z.push(reading.accel_z);

            // Trim buffer
            if (bufferRef.current.x.length > BUFFER_SIZE) {
                bufferRef.current.x.shift();
                bufferRef.current.y.shift();
                bufferRef.current.z.shift();
            }
        });
    }, [nodeReadings]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y, z } = bufferRef.current;
        const centerY = height / 2;
        const scale = height / 4; // Scale factor for visualization

        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        // Horizontal center line
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Vertical grid lines
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        // Draw axes
        const drawLine = (data: number[], color: string) => {
            if (data.length < 2) return;

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.beginPath();

            const step = width / BUFFER_SIZE;
            data.forEach((val, i) => {
                const plotX = i * step;
                const plotY = centerY - val * scale;
                if (i === 0) {
                    ctx.moveTo(plotX, plotY);
                } else {
                    ctx.lineTo(plotX, plotY);
                }
            });

            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        drawLine(x, AXIS_COLORS.x);
        drawLine(y, AXIS_COLORS.y);
        drawLine(z, AXIS_COLORS.z);

        // Draw axis labels
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = AXIS_COLORS.x;
        ctx.fillText('X', 8, 14);
        ctx.fillStyle = AXIS_COLORS.y;
        ctx.fillText('Y', 24, 14);
        ctx.fillStyle = AXIS_COLORS.z;
        ctx.fillText('Z', 40, 14);

        animationRef.current = requestAnimationFrame(draw);
    }, [width, height]);

    // Start animation loop
    useEffect(() => {
        animationRef.current = requestAnimationFrame(draw);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [draw]);

    return (
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#050505]">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="block"
            />
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-50" />
        </div>
    );
}
