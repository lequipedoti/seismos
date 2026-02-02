import type { SensorReading, Node } from '../supabase/types';

// Balat bölgesinde rastgele binalar oluştur
function generateBalatNodes(count: number): Omit<Node, 'created_at'>[] {
    const nodes: Omit<Node, 'created_at'>[] = [];

    const minLat = 41.0260;
    const maxLat = 41.0320;
    const minLng = 28.9420;
    const maxLng = 28.9520;

    for (let i = 1; i <= count; i++) {
        nodes.push({
            id: `node-${i}`,
            name: `Bina ${i}`,
            status: 'stable',
            lat: minLat + Math.random() * (maxLat - minLat),
            lng: minLng + Math.random() * (maxLng - minLng),
            is_physical: false,
        });
    }

    return nodes;
}

export const DEMO_NODES = generateBalatNodes(80);

export interface EarthquakeConfig {
    intensity: number;     // 0.5 - 2.0
    durationMs: number;    // 5000 - 15000
    epicenterLat: number;
    epicenterLng: number;
}

export class EarthquakeSimulator {
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private onReading?: (reading: SensorReading) => void;
    private tickCount = 0;
    private config: EarthquakeConfig | null = null;

    start(onReading: (reading: SensorReading) => void): void {
        this.onReading = onReading;

        // Düşük seviye arka plan titreşimi (normal durum)
        this.intervalId = setInterval(() => {
            this.tickBackground();
        }, 100);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Normal arka plan titreşimi - çok düşük şiddet
    private tickBackground(): void {
        if (!this.onReading) return;

        DEMO_NODES.forEach((node) => {
            const noise = 0.001; // Çok çok düşük - stabil durum
            const accel_x = (Math.random() - 0.5) * noise;
            const accel_y = (Math.random() - 0.5) * noise;
            const accel_z = (Math.random() - 0.5) * noise;
            const magnitude = Math.sqrt(accel_x ** 2 + accel_y ** 2 + accel_z ** 2);

            this.onReading?.({
                id: crypto.randomUUID(),
                node_id: node.id,
                accel_x,
                accel_y,
                accel_z,
                magnitude,
                timestamp: new Date().toISOString(),
            });
        });
    }

    // Deprem simülasyonu başlat
    triggerEarthquake(
        config: EarthquakeConfig,
        onProgress: (progress: number) => void,
        onComplete: () => void
    ): void {
        this.config = config;
        this.tickCount = 0;

        const totalTicks = config.durationMs / 50; // 50ms per tick

        const earthquakeInterval = setInterval(() => {
            this.tickCount++;
            const progress = Math.min(100, (this.tickCount / totalTicks) * 100);
            onProgress(progress);

            // Deprem dalgası
            this.tickEarthquake(config);

            if (this.tickCount >= totalTicks) {
                clearInterval(earthquakeInterval);
                this.config = null;
                onComplete();
            }
        }, 50);
    }

    private tickEarthquake(config: EarthquakeConfig): void {
        if (!this.onReading) return;

        const progress = this.tickCount / (config.durationMs / 50);
        // Dalga envelope: başta yüksel, ortada zirve, sonra azal
        const envelope = Math.sin(progress * Math.PI);

        DEMO_NODES.forEach((node) => {
            // Episantraya uzaklık (basit)
            const distLat = node.lat - config.epicenterLat;
            const distLng = node.lng - config.epicenterLng;
            const distance = Math.sqrt(distLat ** 2 + distLng ** 2);

            // Uzaklığa göre şiddet azalması
            const distanceFactor = Math.max(0.3, 1 - distance * 50);

            // Rastgele varyasyon
            const randomFactor = 0.5 + Math.random();

            const intensity = config.intensity * envelope * distanceFactor * randomFactor;

            const accel_x = (Math.random() - 0.5) * intensity;
            const accel_y = (Math.random() - 0.5) * intensity;
            const accel_z = (Math.random() - 0.5) * intensity + intensity * 0.3;
            const magnitude = Math.sqrt(accel_x ** 2 + accel_y ** 2 + accel_z ** 2);

            this.onReading?.({
                id: crypto.randomUUID(),
                node_id: node.id,
                accel_x,
                accel_y,
                accel_z,
                magnitude,
                timestamp: new Date().toISOString(),
            });
        });
    }
}

export const earthquakeSimulator = new EarthquakeSimulator();
