'use client';

import { useSeismosStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const HEALTH_CONFIG = {
    optimal: { color: '#22c55e', label: 'OPTIMAL', icon: '●' },
    degraded: { color: '#f97316', label: 'DEGRADED', icon: '◐' },
    critical: { color: '#ef4444', label: 'CRITICAL', icon: '○' },
};

export default function Header() {
    const { activeNodeCount, peakMagnitude, systemHealth, isSimulationMode, toggleSimulation } = useSeismosStore();
    const healthConfig = HEALTH_CONFIG[systemHealth];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
                {/* Logo / Title */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-white"
                            >
                                <path d="M2 12h4l3-9 3 18 3-9h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">
                                SEISMOS
                            </h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                Structural Health Monitor
                            </p>
                        </div>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="flex items-center gap-8">
                    {/* Active Nodes */}
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Active Nodes
                        </div>
                        <div className="font-mono text-2xl font-bold text-primary">
                            {activeNodeCount}
                        </div>
                    </div>

                    {/* Peak Magnitude */}
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Peak Magnitude
                        </div>
                        <motion.div
                            className="font-mono text-2xl font-bold"
                            style={{ color: peakMagnitude > 0.5 ? 'var(--status-warning)' : 'var(--status-stable)' }}
                            animate={peakMagnitude > 1.0 ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: peakMagnitude > 1.0 ? Infinity : 0, duration: 0.5 }}
                        >
                            {peakMagnitude.toFixed(3)}g
                        </motion.div>
                    </div>

                    {/* System Health */}
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            System Health
                        </div>
                        <motion.div
                            className="flex items-center justify-center gap-2"
                            animate={systemHealth === 'critical' ? { opacity: [1, 0.5, 1] } : {}}
                            transition={{ repeat: systemHealth === 'critical' ? Infinity : 0, duration: 0.5 }}
                        >
                            <span style={{ color: healthConfig.color }}>{healthConfig.icon}</span>
                            <span
                                className="font-mono text-sm font-bold"
                                style={{ color: healthConfig.color }}
                            >
                                {healthConfig.label}
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSimulation}
                        className={`
              px-4 py-2 rounded-lg font-mono text-sm transition-all border
              ${isSimulationMode
                                ? 'bg-accent text-accent-foreground border-accent-purple'
                                : 'bg-secondary text-secondary-foreground border-border'}
            `}
                    >
                        {isSimulationMode ? '◆ SIMULATION' : '◇ PHYSICAL'}
                    </button>

                    <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                        v1.0.0
                    </Badge>
                </div>
            </div>
        </header>
    );
}
