'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useSeismosStore } from '@/lib/store';
import { DEMO_NODES, earthquakeSimulator } from '@/lib/simulator';
import DashboardPanel from '@/components/dashboard/DashboardPanel';
import SidebarNavigation from '@/components/SidebarNavigation';

const SeismicMap = dynamic(() => import('@/components/map/SeismicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
      Harita yükleniyor...
    </div>
  ),
});

export default function Home() {
  const { setNodes, updateHeartbeat, checkConsensus } = useSeismosStore();
  const isInitialized = useRef(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Node'ları yükle
    setNodes(DEMO_NODES as any);

    // Arka plan sensör simülasyonunu başlat
    earthquakeSimulator.startIdleSimulation();

    // Store'u simülatöre bağla (INSD Logic için)
    const unsubscribe = earthquakeSimulator.onLiveUpdate((readings) => {
      const activeNodeIds = Array.from(readings.keys());
      updateHeartbeat(activeNodeIds);
      checkConsensus(readings);
    });

    return () => {
      unsubscribe();
      earthquakeSimulator.stopIdleSimulation();
    };
  }, [setNodes, updateHeartbeat, checkConsensus]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden flex">
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-auto">
        {/* Emergency Alert Banner - Sadece aktif depremde göster */}
        {showAlert && (
          <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-amber-200 text-sm">
                Seismos aktif izleme modunda. Deprem simülasyonu için Dashboard panelindeki "Deprem Simüle Et" butonunu kullanın.
              </span>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-amber-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Map and Dashboard Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Map - 2/3 genişlik */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl h-full">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Canlı Sismik Harita
                </h2>
                <div className="w-full h-[calc(100%-50px)] rounded-lg overflow-hidden border border-slate-600">
                  <SeismicMap />
                </div>
              </div>
            </div>

            {/* Dashboard Panel - 1/3 genişlik */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl h-full overflow-auto">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Kontrol Paneli
                </h2>
                <DashboardPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
