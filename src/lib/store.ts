import { create } from 'zustand';
import type { Node, SensorReading, NodeStatus } from './supabase/types';
import type { PipelineResult } from './signal-processor';

export interface BuildingSummary {
    safe: number;
    damaged: number;
    critical: number;
    collapsed: number;
}

export interface SeismosState {
    // Nodes
    nodes: Map<string, Node>;
    selectedNodeId: string | null;

    // Readings & Results
    latestReadings: Map<string, SensorReading>;
    processedResults: Map<string, PipelineResult>;

    // Earthquake state
    isEarthquakeActive: boolean;
    earthquakeProgress: number; // 0-100
    buildingSummary: BuildingSummary;

    // Global stats
    activeNodeCount: number;
    peakMagnitude: number;

    // Actions
    setNodes: (nodes: Node[]) => void;
    selectNode: (nodeId: string | null) => void;
    addReading: (reading: SensorReading) => void;
    setProcessedResult: (nodeId: string, result: PipelineResult) => void;
    setEarthquakeActive: (active: boolean) => void;
    setEarthquakeProgress: (progress: number) => void;
    updateBuildingSummary: () => void;
    resetToSafe: () => void;
}

export const useSeismosStore = create<SeismosState>((set, get) => ({
    // Initial state
    nodes: new Map(),
    selectedNodeId: null,
    latestReadings: new Map(),
    processedResults: new Map(),
    isEarthquakeActive: false,
    earthquakeProgress: 0,
    buildingSummary: { safe: 0, damaged: 0, critical: 0, collapsed: 0 },
    activeNodeCount: 0,
    peakMagnitude: 0,

    // Actions
    setNodes: (nodes) => set(() => {
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        return {
            nodes: nodeMap,
            activeNodeCount: nodes.length,
            buildingSummary: { safe: nodes.length, damaged: 0, critical: 0, collapsed: 0 }
        };
    }),

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    addReading: (reading) => set((state) => {
        const newLatest = new Map(state.latestReadings);
        newLatest.set(reading.node_id, reading);
        const newPeak = Math.max(state.peakMagnitude, reading.magnitude);
        return { latestReadings: newLatest, peakMagnitude: newPeak };
    }),

    setProcessedResult: (nodeId, result) => set((state) => {
        const newResults = new Map(state.processedResults);
        newResults.set(nodeId, result);

        // Update node status
        const node = state.nodes.get(nodeId);
        if (node && node.status !== result.status) {
            const updatedNodes = new Map(state.nodes);
            updatedNodes.set(nodeId, { ...node, status: result.status });
            return { processedResults: newResults, nodes: updatedNodes };
        }

        return { processedResults: newResults };
    }),

    setEarthquakeActive: (active) => set({
        isEarthquakeActive: active,
        earthquakeProgress: active ? 0 : 100
    }),

    setEarthquakeProgress: (progress) => set({ earthquakeProgress: progress }),

    updateBuildingSummary: () => set((state) => {
        let safe = 0, damaged = 0, critical = 0, collapsed = 0;

        state.processedResults.forEach((result) => {
            const score = result.damageScore?.score || 0;
            if (score >= 90) collapsed++;
            else if (score >= 70) critical++;
            else if (score >= 30) damaged++;
            else safe++;
        });

        // Count nodes without results as safe
        const noResultCount = state.nodes.size - state.processedResults.size;
        safe += noResultCount;

        return { buildingSummary: { safe, damaged, critical, collapsed } };
    }),

    resetToSafe: () => set((state) => {
        const updatedNodes = new Map(state.nodes);
        updatedNodes.forEach((node, id) => {
            updatedNodes.set(id, { ...node, status: 'stable' });
        });

        return {
            nodes: updatedNodes,
            processedResults: new Map(),
            latestReadings: new Map(),
            peakMagnitude: 0,
            isEarthquakeActive: false,
            earthquakeProgress: 0,
            buildingSummary: { safe: state.nodes.size, damaged: 0, critical: 0, collapsed: 0 }
        };
    }),
}));
