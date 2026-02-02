'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useSeismosStore } from '@/lib/store';
import { earthquakeSimulator, DEMO_NODES } from '@/lib/simulator';
import { signalProcessor } from '@/lib/signal-processor';
import DashboardPanel from '@/components/dashboard/DashboardPanel';

const SeismicMap = dynamic(() => import('@/components/map/SeismicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
      Harita yükleniyor...
    </div>
  ),
});

export default function Home() {
  const {
    setNodes,
    addReading,
    setProcessedResult,
    updateBuildingSummary,
  } = useSeismosStore();

  const isStarted = useRef(false);

  useEffect(() => {
    if (isStarted.current) return;
    isStarted.current = true;

    // Node'ları yükle
    setNodes(DEMO_NODES as any);

    // Arka plan titreşimi başlat
    earthquakeSimulator.start((reading) => {
      addReading(reading);
      const result = signalProcessor.process(reading);
      setProcessedResult(reading.node_id, result);
    });

    // Özet güncellemesi
    const summaryInterval = setInterval(updateBuildingSummary, 500);

    return () => {
      earthquakeSimulator.stop();
      clearInterval(summaryInterval);
    };
  }, [setNodes, addReading, setProcessedResult, updateBuildingSummary]);

  return (
    <div className="h-screen bg-slate-950 flex">
      {/* Harita */}
      <div className="flex-1 p-3">
        <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800">
          <SeismicMap />
        </div>
      </div>

      {/* Panel */}
      <div className="w-[360px] border-l border-slate-800 bg-slate-900">
        <DashboardPanel />
      </div>
    </div>
  );
}
