'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSeismosStore } from '@/lib/store';
import type { NodeStatus } from '@/lib/supabase/types';

// Status color mapping - professional palette
const STATUS_COLORS: Record<NodeStatus, string> = {
    stable: '#10b981',   // Emerald-500
    anomaly: '#f59e0b',  // Amber-500
    warning: '#f97316',  // Orange-500
    critical: '#ef4444', // Red-500
    collapse: '#7c3aed', // Violet-600
};

// Create clean marker icon
function createMarkerIcon(status: NodeStatus, isSelected: boolean, signalLoss: boolean): L.DivIcon {
    const color = STATUS_COLORS[status];
    const size = isSelected ? 28 : 20;
    const opacity = signalLoss ? 0.4 : 1;

    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="opacity: ${opacity}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${color}" stroke="#1e293b" stroke-width="2"/>
      ${isSelected ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.8"/>` : ''}
    </svg>
  `;

    return L.divIcon({
        html: svg,
        className: 'seismos-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

export default function SeismicMap() {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());

    const { nodes, selectedNodeId, selectNode, signalLossNodes, processedResults } = useSeismosStore();
    const [isMapReady, setIsMapReady] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [41.0290, 28.9490],
            zoom: 16,
            minZoom: 15,
            maxZoom: 18,
            maxBounds: [
                [41.0200, 28.9350],
                [41.0400, 28.9650]
            ],
            maxBoundsViscosity: 1.0,
            zoomControl: true,
            attributionControl: true,
        });

        // CartoDB Dark Matter tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

    // Update markers when nodes or processedResults change
    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;

        const map = mapRef.current;

        nodes.forEach((node, nodeId) => {
            const existingMarker = markersRef.current.get(nodeId);
            const isSelected = nodeId === selectedNodeId;
            const hasSignalLoss = signalLossNodes.has(nodeId);

            // Use status from processedResults if available (has damage score), otherwise use node.status
            const processedResult = processedResults.get(nodeId);
            const currentStatus = processedResult?.status || node.status;

            const icon = createMarkerIcon(currentStatus, isSelected, hasSignalLoss);

            if (existingMarker) {
                existingMarker.setIcon(icon);
                existingMarker.setLatLng([node.lat, node.lng]);
            } else {
                const marker = L.marker([node.lat, node.lng], {
                    icon,
                    interactive: true,
                    bubblingMouseEvents: false,
                })
                    .addTo(map)
                    .on('click', (e) => {
                        L.DomEvent.stopPropagation(e);
                        selectNode(nodeId);
                    });

                // Simple tooltip - just the node name
                marker.bindTooltip(node.name, {
                    permanent: false,
                    direction: 'top',
                    className: 'seismos-tooltip',
                    offset: [0, -10],
                });

                markersRef.current.set(nodeId, marker);
            }
        });

        // Remove markers for deleted nodes
        markersRef.current.forEach((marker, nodeId) => {
            if (!nodes.has(nodeId)) {
                marker.remove();
                markersRef.current.delete(nodeId);
            }
        });
    }, [nodes, selectedNodeId, signalLossNodes, processedResults, isMapReady, selectNode]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Tooltip and marker styles */}
            <style jsx global>{`
        .seismos-marker {
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          z-index: 1000 !important;
        }
        .seismos-tooltip {
          background: #1e293b !important;
          border: 1px solid #475569 !important;
          color: #f1f5f9 !important;
          font-family: system-ui, sans-serif !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
          white-space: nowrap !important;
          pointer-events: none !important;
        }
        .seismos-tooltip::before {
          display: none !important;
        }
        .leaflet-tooltip-pane {
          z-index: 650 !important;
        }
        .leaflet-marker-pane {
          z-index: 600 !important;
        }
      `}</style>
        </div>
    );
}
