
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Site, Block } from "@/lib/types";
import type { MapResource, MapMode } from "@/pages/Map";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  sites: Site[];
  blocks: Block[];
  resources: MapResource[];
  selectedSite: Site | null;
  selectedBlock: Block | null;
  mode: MapMode;
  onSiteSelect: (site: Site) => void;
  onBlockSelect: (block: Block) => void;
}

// Mock coordinates for demonstration - in a real app, these would come from the database
const mockSiteCoordinates: Record<string, LatLngExpression> = {
  "site-1": [38.2975, -122.4583], // Napa Valley
  "site-2": [38.2915, -122.4294], // Sonoma
  "site-3": [38.5816, -122.5648], // Calistoga
};

const mockBlockCoordinates: Record<string, LatLngExpression[]> = {
  "block-1": [[38.2975, -122.4583], [38.2985, -122.4583], [38.2985, -122.4593], [38.2975, -122.4593]],
  "block-2": [[38.2965, -122.4583], [38.2975, -122.4583], [38.2975, -122.4593], [38.2965, -122.4593]],
  "block-3": [[38.2915, -122.4294], [38.2925, -122.4294], [38.2925, -122.4304], [38.2915, -122.4304]],
  "block-4": [[38.5816, -122.5648], [38.5826, -122.5648], [38.5826, -122.5658], [38.5816, -122.5658]],
};

const getBlockColor = (blockId: string, selectedBlock: Block | null) => {
  if (selectedBlock?.id === blockId) {
    return { color: '#10b981', fillColor: '#34d399', fillOpacity: 0.3 };
  }
  return { color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.2 };
};

const getResourceIcon = (type: MapResource['type']) => {
  const iconMap = {
    water: '💧',
    building: '🏢',
    equipment: '⚙️',
    other: '📍'
  };
  
  return L.divIcon({
    html: `<div style="font-size: 20px; text-align: center;">${iconMap[type]}</div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

export function MapView({
  sites,
  blocks,
  resources,
  selectedSite,
  selectedBlock,
  mode,
  onSiteSelect,
  onBlockSelect
}: MapViewProps) {
  const mapRef = useRef<L.Map>(null);
  const center: LatLngExpression = [38.2975, -122.4583]; // Napa Valley center

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Site Markers */}
        {sites.map((site) => {
          const coordinates = mockSiteCoordinates[site.id];
          if (!coordinates) return null;
          
          return (
            <Marker
              key={site.id}
              position={coordinates}
              eventHandlers={{
                click: () => onSiteSelect(site),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-medium">{site.name}</h3>
                  <p className="text-sm text-gray-600">{site.address}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {blocks.filter(b => b.siteId === site.id).length} blocks
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Block Polygons */}
        {blocks.map((block) => {
          const coordinates = mockBlockCoordinates[block.id];
          if (!coordinates) return null;
          
          return (
            <Polygon
              key={block.id}
              positions={coordinates}
              pathOptions={getBlockColor(block.id, selectedBlock)}
              eventHandlers={{
                click: () => onBlockSelect(block),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-medium">{block.name}</h3>
                  <p className="text-sm text-gray-600">{block.acres} acres</p>
                  <p className="text-sm text-gray-600">{block.rows} rows</p>
                  <p className="text-sm text-gray-600">{block.vines} vines</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Resource Markers */}
        {resources.map((resource) => (
          <Marker
            key={resource.id}
            position={[resource.lat, resource.lng]}
            icon={getResourceIcon(resource.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{resource.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
