import type { SensorReading, Node } from '../supabase/types';

// Brownian motion generator for realistic noise
export class BrownianMotion {
    private value: number = 0;
    private drift: number;
    private volatility: number;

    constructor(drift: number = 0, volatility: number = 0.05) {
        this.drift = drift;
        this.volatility = volatility;
    }

    next(): number {
        const random = (Math.random() - 0.5) * 2;
        this.value += this.drift + this.volatility * random;
        // Mean reversion to prevent drift
        this.value *= 0.99;
        return this.value;
    }

    reset(): void {
        this.value = 0;
    }
}

// Synthetic seismic event generator
export class SyntheticEventGenerator {
    private isEventActive: boolean = false;
    private eventIntensity: number = 0;
    private eventDuration: number = 0;
    private eventTick: number = 0;

    triggerEvent(intensity: number = 0.8, durationTicks: number = 50): void {
        this.isEventActive = true;
        this.eventIntensity = intensity;
        this.eventDuration = durationTicks;
        this.eventTick = 0;
    }

    next(): number {
        if (!this.isEventActive) return 0;

        this.eventTick++;
        if (this.eventTick >= this.eventDuration) {
            this.isEventActive = false;
            return 0;
        }

        // Create a pulse envelope
        const progress = this.eventTick / this.eventDuration;
        const envelope = Math.sin(progress * Math.PI);
        const noise = (Math.random() - 0.5) * 0.3;

        return this.eventIntensity * envelope + noise;
    }

    get active(): boolean {
        return this.isEventActive;
    }
}

export interface SimulatorConfig {
    tickInterval: number; // ms
    baseNoise: number;
    eventProbability: number; // per tick
    nodeCount: number;
}

const DEFAULT_CONFIG: SimulatorConfig = {
    tickInterval: 50, // 20 Hz
    baseNoise: 0.02,
    eventProbability: 0.002,
    nodeCount: 6,
};

// Demo nodes for simulation
// Helper to generate random coordinates within Balat bounds
function generateBalatNodes(count: number): Omit<Node, 'created_at'>[] {
    const nodes: Omit<Node, 'created_at'>[] = [];

    // Balat Bounds (Strict Land Only - Avoiding Mürselpaşa Cd/Coast)
    const minLat = 41.0260; // Pulled North from Unkapani
    const maxLat = 41.0310; // Capped South of Coast
    const minLng = 28.9430; // Pulled East 
    const maxLng = 28.9490; // Strictly West of Mürselpaşa Cd

    for (let i = 1; i <= count; i++) {
        nodes.push({
            id: `node-${i}`,
            name: `${i}`,
            status: 'stable',
            lat: minLat + Math.random() * (maxLat - minLat),
            lng: minLng + Math.random() * (maxLng - minLng),
            is_physical: false,
        });
    }

    // Add the physical sensor separately
    nodes.push({
        id: 'ESP32_MAIN',
        name: 'SENSOR_MAIN',
        status: 'stable',
        lat: 41.0295,
        lng: 28.9500,
        is_physical: true
    });

    return nodes;
}

// Generate 100 building nodes
export const DEMO_NODES = generateBalatNodes(100);

export class Simulator {
    private config: SimulatorConfig;
    private brownianMotions: Map<string, { x: BrownianMotion; y: BrownianMotion; z: BrownianMotion }>;
    private eventGenerators: Map<string, SyntheticEventGenerator>;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private onReading?: (reading: SensorReading) => void;

    constructor(config: Partial<SimulatorConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.brownianMotions = new Map();
        this.eventGenerators = new Map();

        // Initialize generators for each node
        DEMO_NODES.forEach((node) => {
            this.brownianMotions.set(node.id, {
                x: new BrownianMotion(0, this.config.baseNoise),
                y: new BrownianMotion(0, this.config.baseNoise),
                z: new BrownianMotion(0, this.config.baseNoise),
            });
            this.eventGenerators.set(node.id, new SyntheticEventGenerator());
        });
    }

    start(onReading: (reading: SensorReading) => void): void {
        this.onReading = onReading;

        this.intervalId = setInterval(() => {
            this.tick();
        }, this.config.tickInterval);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private tick(): void {
        // Random chance to trigger a correlated event
        if (Math.random() < this.config.eventProbability) {
            this.triggerCorrelatedEvent();
        }

        // Generate readings for all non-physical nodes
        DEMO_NODES.forEach((node) => {
            if (node.is_physical) return; // Skip physical nodes

            const motion = this.brownianMotions.get(node.id)!;
            const event = this.eventGenerators.get(node.id)!;

            const eventMagnitude = event.next();
            const accel_x = motion.x.next() + eventMagnitude * (Math.random() - 0.5);
            const accel_y = motion.y.next() + eventMagnitude * (Math.random() - 0.5);
            const accel_z = motion.z.next() + eventMagnitude;

            const magnitude = Math.sqrt(accel_x ** 2 + accel_y ** 2 + accel_z ** 2);

            const reading: SensorReading = {
                id: crypto.randomUUID(),
                node_id: node.id,
                accel_x,
                accel_y,
                accel_z,
                magnitude,
                timestamp: new Date().toISOString(),
            };

            this.onReading?.(reading);
        });
    }

    private triggerCorrelatedEvent(): void {
        // Pick 2-4 random adjacent nodes to simulate correlated seismic event
        const nodeCount = 2 + Math.floor(Math.random() * 3);
        const shuffled = [...DEMO_NODES].filter(n => !n.is_physical).sort(() => Math.random() - 0.5);
        const selectedNodes = shuffled.slice(0, nodeCount);

        const intensity = 0.3 + Math.random() * 0.8; // 0.3g to 1.1g
        const duration = 30 + Math.floor(Math.random() * 40); // 30-70 ticks

        selectedNodes.forEach((node) => {
            this.eventGenerators.get(node.id)?.triggerEvent(intensity, duration);
        });

        console.log(`[SEISMOS] Synthetic event triggered: ${selectedNodes.map(n => n.name).join(', ')} @ ${intensity.toFixed(2)}g`);
    }

    triggerManualEvent(nodeIds: string[], intensity: number = 0.8): void {
        nodeIds.forEach((nodeId) => {
            this.eventGenerators.get(nodeId)?.triggerEvent(intensity, 50);
        });
    }
}

export const simulator = new Simulator();
