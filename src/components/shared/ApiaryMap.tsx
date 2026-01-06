'use client';

import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PlantObservationsLayer from './map/PlantObservationsLayer';

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface ApiaryMapProps {
  latitude: number;
  longitude: number;
  apiaryName: string;
}

export default function ApiaryMap({ latitude, longitude, apiaryName }: ApiaryMapProps) {
  const position: [number, number] = [latitude, longitude];
  const [showPlants, setShowPlants] = useState(false);
  const [showDistance, setShowDistance] = useState(false);
  const [only2km, setOnly2km] = useState(false);
  const [currentSeasonOnly, setCurrentSeasonOnly] = useState(false);

  // Listen to toggle changes from the checkboxes in the page
  useEffect(() => {
    const plantToggle = document.getElementById('plantToggle') as HTMLInputElement;
    const distanceToggle = document.getElementById('distanceToggle') as HTMLInputElement;
    const rangeToggle = document.getElementById('rangeToggle') as HTMLInputElement;
    const seasonToggle = document.getElementById('seasonToggle') as HTMLInputElement;
    
    const handlePlantChange = () => setShowPlants(plantToggle?.checked || false);
    const handleDistanceChange = () => setShowDistance(distanceToggle?.checked || false);
    const handleRangeChange = () => setOnly2km(rangeToggle?.checked || false);
    const handleSeasonChange = () => setCurrentSeasonOnly(seasonToggle?.checked || false);

    if (plantToggle) {
      plantToggle.addEventListener('change', handlePlantChange);
    }
    if (distanceToggle) {
      distanceToggle.addEventListener('change', handleDistanceChange);
    }
    if (rangeToggle) {
      rangeToggle.addEventListener('change', handleRangeChange);
    }
    if (seasonToggle) {
      seasonToggle.addEventListener('change', handleSeasonChange);
    }

    return () => {
      plantToggle?.removeEventListener('change', handlePlantChange);
      distanceToggle?.removeEventListener('change', handleDistanceChange);
      rangeToggle?.removeEventListener('change', handleRangeChange);
      seasonToggle?.removeEventListener('change', handleSeasonChange);
    };
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      
      <Marker position={position}>
        <Popup>{apiaryName}</Popup>
      </Marker>
      
      <Circle
        center={position}
        radius={7000}
        pathOptions={{
          color: '#9b59b6',
          fillColor: '#9b59b6',
          fillOpacity: 0.15,
          weight: 2,
        }}
      />
      
      <Circle
        center={position}
        radius={2000}
        pathOptions={{
          color: '#3498db',
          fillColor: '#3498db',
          fillOpacity: 0.25,
          weight: 3,
        }}
      />
      
      {showPlants && (
        <PlantObservationsLayer 
          latitude={latitude} 
          longitude={longitude} 
          radiusKm={only2km ? 2 : 7}
          showDistance={showDistance}
          currentSeasonOnly={currentSeasonOnly}
        />
      )}
    </MapContainer>
  );
}
