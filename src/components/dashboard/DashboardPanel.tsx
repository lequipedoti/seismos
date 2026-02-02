'use client';

import { useState } from 'react';
import { useSeismosStore } from '@/lib/store';
import { earthquakeSimulator, DEMO_NODES } from '@/lib/simulator';
import { signalProcessor } from '@/lib/signal-processor';

export default function DashboardPanel() {
    const {
        selectedNodeId,
        nodes,
        processedResults,
        selectNode,
        buildingSummary,
        isEarthquakeActive,
        earthquakeProgress,
        setEarthquakeActive,
        setEarthquakeProgress,
        addReading,
        setProcessedResult,
        updateBuildingSummary,
        resetToSafe,
    } = useSeismosStore();

    const [canReset, setCanReset] = useState(false);

    const node = selectedNodeId ? nodes.get(selectedNodeId) : null;
    const result = selectedNodeId ? processedResults.get(selectedNodeId) : null;

    const handleTriggerEarthquake = () => {
        if (isEarthquakeActive) return;

        setEarthquakeActive(true);
        setCanReset(false);

        // Rastgele episantr seç
        const epicenter = DEMO_NODES[Math.floor(Math.random() * DEMO_NODES.length)];

        earthquakeSimulator.triggerEarthquake(
            {
                intensity: 1.2 + Math.random() * 0.8, // 1.2 - 2.0
                durationMs: 6000,
                epicenterLat: epicenter.lat,
                epicenterLng: epicenter.lng,
            },
            (progress) => {
                setEarthquakeProgress(progress);
            },
            () => {
                setEarthquakeActive(false);
                updateBuildingSummary();
                setTimeout(() => setCanReset(true), 2000);
            }
        );
    };

    const handleReset = () => {
        resetToSafe();
        setCanReset(false);
    };

    // Skor rengini belirle
    const getScoreColor = (score: number) => {
        if (score >= 90) return { bg: 'bg-red-500', text: 'text-red-400', label: 'Yıkılmış' };
        if (score >= 70) return { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Ağır Hasarlı' };
        if (score >= 30) return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Hasarlı' };
        return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Güvenli' };
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">SEISMOS</h1>
                        <p className="text-xs text-slate-500">Deprem İzleme Sistemi</p>
                    </div>
                </div>
            </div>

            {/* Deprem Butonu */}
            <div className="p-4 border-b border-slate-800">
                {isEarthquakeActive ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-400 font-medium">Deprem Aktif!</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all duration-100"
                                style={{ width: `${earthquakeProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={handleTriggerEarthquake}
                            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Deprem Simüle Et
                        </button>
                        {canReset && (
                            <button
                                onClick={handleReset}
                                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
                            >
                                Sıfırla
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Özet */}
            <div className="p-4 border-b border-slate-800">
                <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
                    Bina Durumu Özeti
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-emerald-400">{buildingSummary.safe}</div>
                        <div className="text-xs text-emerald-400/70">Güvenli</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-yellow-400">{buildingSummary.damaged}</div>
                        <div className="text-xs text-yellow-400/70">Hasarlı</div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-400">{buildingSummary.critical}</div>
                        <div className="text-xs text-orange-400/70">Ağır Hasarlı</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">{buildingSummary.collapsed}</div>
                        <div className="text-xs text-red-400/70">Yıkılmış</div>
                    </div>
                </div>
            </div>

            {/* Seçili Bina Detayı */}
            <div className="flex-1 overflow-y-auto p-4">
                {node ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-white">{node.name}</h2>
                                <p className="text-xs text-slate-500">{node.id}</p>
                            </div>
                            <button
                                onClick={() => selectNode(null)}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {result?.damageScore && (
                            <div className={`rounded-xl p-4 ${getScoreColor(result.damageScore.score).bg}/10 border ${getScoreColor(result.damageScore.score).bg}/20`}>
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Hasar Skoru</div>
                                        <div className={`text-4xl font-bold ${getScoreColor(result.damageScore.score).text}`}>
                                            {result.damageScore.score}
                                            <span className="text-lg text-slate-500">/100</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.damageScore.score).bg}/20 ${getScoreColor(result.damageScore.score).text}`}>
                                        {getScoreColor(result.damageScore.score).label}
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getScoreColor(result.damageScore.score).bg} transition-all`}
                                        style={{ width: `${result.damageScore.score}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-500">
                                Detayları görmek için<br />haritadan bir bina seçin
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
