'use client';

import dynamic from 'next/dynamic';
import SidebarNavigation from '@/components/SidebarNavigation';
import { useSeismosStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { DEMO_NODES, earthquakeSimulator } from '@/lib/simulator';

const SeismicMap = dynamic(() => import('@/components/map/SeismicMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
            Harita yükleniyor...
        </div>
    ),
});

export default function HaritaPage() {
    const { setNodes, updateHeartbeat, checkConsensus } = useSeismosStore();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;
        setNodes(DEMO_NODES as any);
        earthquakeSimulator.startIdleSimulation();
        const unsubscribe = earthquakeSimulator.onLiveUpdate((readings) => {
            updateHeartbeat(Array.from(readings.keys()));
            checkConsensus(readings);
        });
        return () => { unsubscribe(); earthquakeSimulator.stopIdleSimulation(); };
    }, [setNodes, updateHeartbeat, checkConsensus]);

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-4">
                    <h1 className="text-white font-semibold">Sismik Harita - Tam Ekran</h1>
                </div>
                <div className="flex-1">
                    <SeismicMap />
                </div>
            </div>
        </div>
    );
}
