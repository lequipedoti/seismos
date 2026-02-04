'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useSeismosStore } from '@/lib/store';
import { DEMO_NODES, earthquakeSimulator } from '@/lib/simulator';
import DashboardPanel from '@/components/dashboard/DashboardPanel';
import StatsCard from '@/components/StatsCard';
import EmergencyAlertBanner from '@/components/EmergencyAlertBanner';
import SidebarNavigation from '@/components/SidebarNavigation';
import RealTimeDataCard from '@/components/RealTimeDataCard';
import AnimatedProgressBar from '@/components/AnimatedProgressBar';

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
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Emergency Alert Banner */}
      <EmergencyAlertBanner 
        message="Seismic activity detected in the region. Please remain alert and follow safety protocols."
        severity="warning"
        actionText="View Details"
        onAction={() => console.log('View details clicked')}
        onDismiss={() => console.log('Alert dismissed')}
      />

      {/* Main Content Area */}
      <div className="lg:ml-80 xl:ml-96 min-h-screen">
        {/* Stats Cards Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              buildingCount={1247}
              damagePercentage={15}
              status="damaged"
            />
            <StatsCard 
              buildingCount={892}
              damagePercentage={5}
              status="safe"
            />
            <StatsCard 
              buildingCount={156}
              damagePercentage={45}
              status="critical"
            />
          </div>

          {/* Real-time Data Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RealTimeDataCard 
              title="Seismic Activity Level"
              currentValue={742}
              unit="RMS"
              dataPoints={[650, 680, 720, 700, 742]}
              timeRange="Last 24 Hours"
              trendDirection="up"
              trendPercentage={12.5}
              color="red"
            />
            <RealTimeDataCard 
              title="Network Health Score"
              currentValue={94.8}
              unit="%"
              dataPoints={[89.2, 91.5, 92.8, 93.6, 94.8]}
              timeRange="Last 24 Hours"
              trendDirection="up"
              trendPercentage={6.2}
              color="green"
            />
          </div>

          {/* Progress Bars Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">System Resources</h3>
              <AnimatedProgressBar 
                percentage={65}
                label="CPU Usage"
                color="blue"
                size="lg"
                animated={true}
                striped={true}
              />
              <div className="mt-6 space-y-4">
                <AnimatedProgressBar 
                  percentage={42}
                  label="Memory Usage"
                  color="cyan"
                  size="md"
                  animated={true}
                  striped={false}
                />
                <AnimatedProgressBar 
                  percentage={88}
                  label="Storage Usage"
                  color="yellow"
                  size="md"
                  animated={true}
                  striped={true}
                />
                <AnimatedProgressBar 
                  percentage={23}
                  label="Network Bandwidth"
                  color="green"
                  size="md"
                  animated={true}
                  striped={false}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Damage Assessment Progress</h3>
              <div className="space-y-6">
                <AnimatedProgressBar 
                  percentage={78}
                  label="Structural Analysis"
                  color="red"
                  size="lg"
                  animated={true}
                  striped={true}
                />
                <AnimatedProgressBar 
                  percentage={92}
                  label="Risk Evaluation"
                  color="purple"
                  size="lg"
                  animated={true}
                  striped={true}
                />
                <AnimatedProgressBar 
                  percentage={45}
                  label="Emergency Response"
                  color="yellow"
                  size="lg"
                  animated={true}
                  striped={true}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Data Processing Status</h3>
              <div className="space-y-6">
                <AnimatedProgressBar 
                  percentage={100}
                  label="Sensor Data Collection"
                  color="green"
                  size="lg"
                  animated={true}
                  striped={false}
                />
                <AnimatedProgressBar 
                  percentage={85}
                  label="Data Validation"
                  color="blue"
                  size="lg"
                  animated={true}
                  striped={true}
                />
                <AnimatedProgressBar 
                  percentage={67}
                  label="AI Analysis Complete"
                  color="cyan"
                  size="lg"
                  animated={true}
                  striped={false}
                />
                <AnimatedProgressBar 
                  percentage={34}
                  label="Report Generation"
                  color="purple"
                  size="lg"
                  animated={true}
                  striped={true}
                />
              </div>
            </div>
          </div>

          {/* Map and Dashboard Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Live Seismic Map</h2>
                <div className="w-full h-[600px] rounded-lg overflow-hidden border border-slate-600">
                  <SeismicMap />
                </div>
              </div>
            </div>

            {/* Dashboard Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4">System Dashboard</h2>
                <DashboardPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
