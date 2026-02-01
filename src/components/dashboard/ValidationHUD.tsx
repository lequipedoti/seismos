'use client';

import { useSeismosStore } from '@/lib/store';
import { motion } from 'framer-motion';

const STAGES = [
    { id: 'raw', name: 'HAM VERİ', description: 'Doğrudan sinyal akışı' },
    { id: 'filter', name: 'FİLTRE', description: 'Hareketli ortalama + Yüksek Geçiren' },
    { id: 'correlate', name: 'KORELASYON', description: 'Çoklu düğüm karşılaştırma' },
    { id: 'interpret', name: 'YORUMLAMA', description: 'Durum sınıflandırması' },
] as const;

const STATUS_COLORS = {
    idle: '#737373',
    processing: '#06b6d4',
    complete: '#22c55e',
    error: '#ef4444',
};

export default function ValidationHUD() {
    const { pipelineStages } = useSeismosStore();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
                Veri Akış Kontrolü
            </div>

            <div className="space-y-3">
                {STAGES.map((stage, index) => {
                    const status = pipelineStages[stage.id as keyof typeof pipelineStages];
                    const color = STATUS_COLORS[status];
                    const isActive = status === 'processing';
                    const isComplete = status === 'complete';

                    return (
                        <div key={stage.id} className="relative">
                            {/* Connector line */}
                            {index > 0 && (
                                <div
                                    className="absolute left-[11px] -top-3 w-0.5 h-3"
                                    style={{ backgroundColor: isComplete ? '#22c55e' : 'var(--border)' }}
                                />
                            )}

                            <div className="flex items-center gap-3">
                                {/* Status indicator */}
                                <motion.div
                                    className="relative w-6 h-6 flex items-center justify-center"
                                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-full opacity-30"
                                        style={{
                                            backgroundColor: color,
                                            boxShadow: isActive ? `0 0 12px ${color}` : 'none',
                                        }}
                                    />
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </motion.div>

                                {/* Stage info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-mono text-sm font-semibold"
                                            style={{ color }}
                                        >
                                            {stage.name}
                                        </span>
                                        {isActive && (
                                            <motion.span
                                                className="text-xs text-cyan-500 font-mono"
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                İŞLENİYOR...
                                            </motion.span>
                                        )}
                                        {isComplete && (
                                            <span className="text-xs text-green-500 font-mono">
                                                ✓ ONAYLANDI
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {stage.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
