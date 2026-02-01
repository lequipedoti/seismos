'use client';

import { useEffect, useRef } from 'react';
import { useSeismosStore } from '@/lib/store';

export default function SoundManager() {
    const { systemHealth } = useSeismosStore();
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextBeepTimeRef = useRef<number>(0);

    useEffect(() => {
        // Initialize AudioContext on first user interaction (browser policy)
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        window.addEventListener('click', initAudio);
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const playBeep = (frequency: number, type: OscillatorType, duration: number) => {
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    // Check for critical events
    useEffect(() => {
        if (systemHealth === 'critical') {
            const interval = setInterval(() => {
                // Double beep for critical
                playBeep(880, 'square', 0.1);
                setTimeout(() => playBeep(880, 'square', 0.1), 150);
            }, 2000);
            return () => clearInterval(interval);
        } else if (systemHealth === 'degraded') {
            const interval = setInterval(() => {
                // Single beep for warning
                playBeep(440, 'sine', 0.2);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [systemHealth]);

    return null; // Invisible component
}
