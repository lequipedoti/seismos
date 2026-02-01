'use client';

import { ReactNode } from 'react';
import DeepInspectionPanel from './DeepInspectionPanel';
import SoundManager from '../effects/SoundManager';
import { useSeismosStore } from '@/lib/store';

interface CommandCenterProps {
    children: ReactNode;
}

export default function CommandCenter({ children }: CommandCenterProps) {
    const { selectedNodeId } = useSeismosStore();

    return (
        <div className="h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden flex flex-col">
            <SoundManager />

            <main className="flex-1 relative flex h-full bg-muted/10">
                {/* Map Area - Contained with padding */}
                <div className="flex-1 relative h-full p-6">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-border relative bg-card">
                        {children}
                    </div>
                </div>

                {/* Permanent Sidebar Area - Fixed width */}
                <div className="w-[400px] border-l border-border bg-background z-40 h-full overflow-hidden shrink-0">
                    <DeepInspectionPanel />
                </div>
            </main>
        </div>
    );
}
