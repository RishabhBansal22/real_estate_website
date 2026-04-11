"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function LocationMap({ 
  locationName 
}: { 
  locationName: string 
}) {
  const [coords, setCoords] = useState<[number, number]>([19.0760, 72.8777]); // Default Mumbai
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // In a real app, we'd geocode locationName. 
    // For now, let's pick a pseudo-random point near a center based on string seed
    const seed = locationName.length;
    const latOffset = (seed % 10) / 100;
    const lngOffset = (seed % 5) / 100;
    
    setCoords([19.0760 + latOffset, 72.8777 + lngOffset]);
  }, [locationName]);

  if (!mounted) return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl" />;

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 z-0">
      <MapContainer 
        center={coords} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={icon}>
          <Popup>
            <span className="font-bold text-slate-800">{locationName}</span>
          </Popup>
        </Marker>
        <ChangeView center={coords} />
      </MapContainer>
    </div>
  );
}
