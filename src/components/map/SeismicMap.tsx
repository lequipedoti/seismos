'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSeismosStore } from '@/lib/store';
import type { NodeStatus } from '@/lib/supabase/types';

// Status colors
const STATUS_COLORS: Record<NodeStatus, string> = {
    stable: '#10b981',
    anomaly: '#f59e0b',
    warning: '#f97316',
    critical: '#ef4444',
    collapse: '#7c3aed',
};

export default function SeismicMap() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

    const { nodes, selectedNodeId, selectNode, processedResults } = useSeismosStore();
    const [isMapReady, setIsMapReady] = useState(false);

    // Initialize map once
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [41.0290, 28.9490],
            zoom: 16,
            minZoom: 14,
            maxZoom: 18,
            zoomControl: true,
            attributionControl: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OSM &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map);

        mapRef.current = map;
        setIsMapReady(true);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Update markers
    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;

        const map = mapRef.current;

        // Update or create markers
        nodes.forEach((node, nodeId) => {
            const isSelected = nodeId === selectedNodeId;

            // Get status from processed results or fall back to node status
            const result = processedResults.get(nodeId);
            const status = result?.status || node.status;
            const color = STATUS_COLORS[status];

            const existingMarker = markersRef.current.get(nodeId);

            if (existingMarker) {
                // Update existing marker
                existingMarker.setStyle({
                    fillColor: color,
                    color: isSelected ? '#ffffff' : '#1e293b',
                    weight: isSelected ? 3 : 1,
                    radius: isSelected ? 10 : 6,
                });
                existingMarker.setLatLng([node.lat, node.lng]);
            } else {
                // Create new CircleMarker (simpler than DivIcon)
                const marker = L.circleMarker([node.lat, node.lng], {
                    radius: 6,
                    fillColor: color,
                    color: '#1e293b',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1,
                });

                // Click handler
                marker.on('click', () => {
                    selectNode(nodeId);
                });

                marker.addTo(map);
                markersRef.current.set(nodeId, marker);
            }
        });

        // Remove old markers
        markersRef.current.forEach((marker, nodeId) => {
            if (!nodes.has(nodeId)) {
                marker.remove();
                markersRef.current.delete(nodeId);
            }
        });
    }, [nodes, selectedNodeId, processedResults, isMapReady, selectNode]);

    return (
        <div className="w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}
