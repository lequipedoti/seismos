'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSeismosStore } from '@/lib/store';
import type { NodeStatus } from '@/lib/supabase/types';

// Renk paleti
const STATUS_COLORS: Record<string, string> = {
    stable: '#10b981',   // Yeşil
    safe: '#10b981',
    anomaly: '#eab308',  // Sarı
    damaged: '#eab308',
    warning: '#f97316',  // Turuncu
    critical: '#ef4444', // Kırmızı
    collapse: '#dc2626', // Koyu kırmızı
};

// Skor'a göre renk
function getColorByScore(score: number): string {
    if (score >= 90) return '#dc2626'; // Yıkılmış
    if (score >= 70) return '#f97316'; // Ağır hasarlı
    if (score >= 30) return '#eab308'; // Hasarlı
    return '#10b981'; // Güvenli
}

export default function SeismicMap() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<Map<string, L.CircleMarker | L.Marker>>(new Map());

    const { nodes, selectedNodeId, selectNode, processedResults, isEarthquakeActive } = useSeismosStore();
    const [isMapReady, setIsMapReady] = useState(false);

    // Harita başlat
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [41.0290, 28.9470],
            zoom: 16,
            minZoom: 14,
            maxZoom: 18,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CARTO',
            subdomains: 'abcd',
        }).addTo(map);

        mapRef.current = map;
        setIsMapReady(true);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Marker güncelle
    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;

        const map = mapRef.current;

        nodes.forEach((node, nodeId) => {
            const isSelected = nodeId === selectedNodeId;
            const result = processedResults.get(nodeId);
            const score = result?.damageScore?.score || 0;
            const color = getColorByScore(score);
            const isCollapsed = score >= 90;

            // Mevcut marker'ı sil (tür değişebilir)
            const existingMarker = markersRef.current.get(nodeId);

            if (isCollapsed) {
                // Yıkılmış bina - X icon
                if (existingMarker) {
                    existingMarker.remove();
                }

                const xIcon = L.divIcon({
                    html: `
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" fill="${color}" stroke="#1e293b" stroke-width="2"/>
                            <path d="M6 6L14 14M14 6L6 14" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    `,
                    className: 'collapsed-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });

                const marker = L.marker([node.lat, node.lng], { icon: xIcon })
                    .on('click', () => selectNode(nodeId))
                    .addTo(map);

                markersRef.current.set(nodeId, marker);
            } else {
                // Normal bina - daire
                if (existingMarker && 'setRadius' in existingMarker) {
                    // Mevcut CircleMarker güncelle
                    const circleMarker = existingMarker as L.CircleMarker;
                    circleMarker.setStyle({
                        fillColor: color,
                        color: isSelected ? '#ffffff' : '#1e293b',
                        weight: isSelected ? 3 : 1,
                        radius: isSelected ? 10 : (score > 30 ? 8 : 6),
                    });
                    circleMarker.setLatLng([node.lat, node.lng]);
                } else {
                    // Yeni CircleMarker oluştur
                    if (existingMarker) existingMarker.remove();

                    const marker = L.circleMarker([node.lat, node.lng], {
                        radius: 6,
                        fillColor: color,
                        color: '#1e293b',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1,
                    })
                        .on('click', () => selectNode(nodeId))
                        .addTo(map);

                    markersRef.current.set(nodeId, marker);
                }
            }
        });

        // Silinmiş node'ların marker'ını temizle
        markersRef.current.forEach((marker, nodeId) => {
            if (!nodes.has(nodeId)) {
                marker.remove();
                markersRef.current.delete(nodeId);
            }
        });
    }, [nodes, selectedNodeId, processedResults, isMapReady, selectNode]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Deprem aktif uyarısı */}
            {isEarthquakeActive && (
                <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <span className="text-white font-medium text-sm">Deprem Aktif</span>
                </div>
            )}

            <style jsx global>{`
                .collapsed-marker {
                    background: transparent !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
}
