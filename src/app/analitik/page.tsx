'use client';

import SidebarNavigation from '@/components/SidebarNavigation';
import { Activity, Cpu, Database, Wifi, Clock, TrendingUp } from 'lucide-react';
import RealTimeResourceChart from '@/components/RealTimeResourceChart';
import { useSeismosStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function AnalitikPage() {
    const { activeNodeCount, isEarthquakeActive } = useSeismosStore();
    const [simulatedCPU, setSimulatedCPU] = useState(23);
    const [simulatedNetwork, setSimulatedNetwork] = useState(45);

    // Derive metrics from store state
    useEffect(() => {
        const interval = setInterval(() => {
            // CPU Load: Base 20% + Active Nodes impact + Random Noise + Earthquake Surge
            const baseLoad = 20;
            const nodeImpact = activeNodeCount * 0.2; // 80 nodes * 0.2 = ~16%
            const quakeSurge = isEarthquakeActive ? 30 : 0; // Huge jump during quake
            const noise = (Math.random() - 0.5) * 5;

            const newCPU = Math.min(100, Math.max(5, baseLoad + nodeImpact + quakeSurge + noise));
            setSimulatedCPU(newCPU);

            // Network Traffic: Steady heartbeat + Earthquake events
            const baseNet = 30; // Heartbeats
            const quakeNet = isEarthquakeActive ? 50 : 0; // Consensus traffic flood
            const netNoise = (Math.random() - 0.5) * 15;

            const newNet = Math.min(100, Math.max(10, baseNet + quakeNet + netNoise));
            setSimulatedNetwork(newNet);

        }, 1000);

        return () => clearInterval(interval);
    }, [activeNodeCount, isEarthquakeActive]);

    const metrics = [
        { label: 'Aktif Sensörler', value: `${activeNodeCount}/80`, icon: Wifi, color: 'green', change: isEarthquakeActive ? 'Yüksek Trafik' : 'Stabil' },
        { label: 'Ortalama Gecikme', value: isEarthquakeActive ? '45ms' : '12ms', icon: Clock, color: 'blue', change: isEarthquakeActive ? '+33ms' : '-3ms' },
        { label: 'CPU Kullanımı', value: `${Math.round(simulatedCPU)}%`, icon: Cpu, color: 'purple', change: isEarthquakeActive ? '+High' : 'Normal' },
        { label: 'Veri İşleme Hızı', value: isEarthquakeActive ? '4.8K/s' : '1.2K/s', icon: Database, color: 'cyan', change: isEarthquakeActive ? '+300%' : '+15%' },
        { label: 'Hata Oranı', value: '0.02%', icon: Activity, color: 'yellow', change: '-0.01%' },
        { label: 'Uptime', value: '99.97%', icon: TrendingUp, color: 'green', change: '+0.02%' },
    ];

    const colorMap: Record<string, string> = {
        green: 'from-green-500 to-emerald-600',
        blue: 'from-blue-500 to-cyan-600',
        purple: 'from-purple-500 to-pink-600',
        cyan: 'from-cyan-500 to-blue-600',
        yellow: 'from-yellow-500 to-orange-600',
    };

    return (
        <div className="h-screen bg-slate-950 overflow-hidden flex">
            <SidebarNavigation />
            <div className="flex-1 h-screen overflow-hidden flex flex-col">
                <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-6">
                    <h1 className="text-white font-semibold">Sistem Analitiği</h1>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {metrics.map((metric, i) => {
                            const Icon = metric.icon;
                            return (
                                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorMap[metric.color]} flex items-center justify-center mb-3`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                                    <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                                    <div className="text-xs text-green-400">{metric.change}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* System Status & Live Monitoring */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Live Charts */}
                        <div className="space-y-6">
                            <RealTimeResourceChart
                                title="CPU Kullanımı"
                                subtitle="Sismik Veri İşleme Yükü"
                                dataKey="value"
                                color="cyan"
                                maxValue={100}
                                showLiveIndicator={true}
                                value={simulatedCPU}
                            />
                            <RealTimeResourceChart
                                title="Ağ Trafiği"
                                subtitle="Sensör Veri Akışı"
                                dataKey="value"
                                color="blue"
                                maxValue={100}
                                showLiveIndicator={true}
                                value={simulatedNetwork}
                            />
                        </div>

                        {/* Recent Events */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-fit">
                            <h3 className="text-white font-semibold mb-4">Son Sistem Olayları</h3>
                            <div className="space-y-3">
                                {[
                                    { time: '14:32', event: 'AI Model güncellemesi uygulandı', type: 'info' },
                                    { time: '14:28', event: 'SEN-023 sensörü yeniden başlatıldı', type: 'warning' },
                                    { time: '14:15', event: 'Günlük yedekleme tamamlandı', type: 'success' },
                                    { time: '13:45', event: 'Deprem simülasyonu çalıştırıldı', type: 'info' },
                                    { time: '13:30', event: 'Sistem sağlık kontrolü başarılı', type: 'success' },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500 w-12">{log.time}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'success' ? 'bg-green-400' :
                                            log.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                                            }`}></div>
                                        <span className="text-sm text-slate-300">{log.event}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
