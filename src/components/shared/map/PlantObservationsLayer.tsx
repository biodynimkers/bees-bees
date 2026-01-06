'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getPlantObservations, PlantObservation } from '@/lib/waarnemingen-api';

interface PlantObservationsLayerProps {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  showDistance?: boolean;
  currentSeasonOnly?: boolean;
}

// Calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if plant blooms in current month
const bloomsNow = (observation: PlantObservation): boolean => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  // Simplified bloom periods for common bee plants
  const bloomPeriods: Record<string, number[]> = {
    'Tilia': [6, 7], // Linde: juni-juli
    'Salix': [3, 4], // Wilg: maart-april
    'Trifolium pratense': [5, 6, 7, 8, 9], // Rode klaver: mei-sept
    'Trifolium repens': [5, 6, 7, 8, 9], // Witte klaver: mei-sept
    'Crataegus': [5, 6], // Meidoorn: mei-juni
    'Prunus': [4, 5], // Prunus: april-mei
  };
  
  const periods = bloomPeriods[observation.scientificName];
  return periods ? periods.includes(currentMonth) : true; // Show unknown plants
};

// Custom icons for different plant categories
const createPlantIcon = (category: string) => {
  const colors = {
    nectar: '#f39c12', // Orange voor nectar
    pollen: '#e74c3c', // Rood voor pollen
    water: '#3498db', // Blauw voor water
    other: '#95a5a6', // Grijs voor overige
  };
  
  return L.divIcon({
    className: 'custom-plant-icon',
    html: `<div style="
      background-color: ${colors[category as keyof typeof colors] || colors.other};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export default function PlantObservationsLayer({ 
  latitude, 
  longitude, 
  radiusKm = 7,
  showDistance = false,
  currentSeasonOnly = false
}: PlantObservationsLayerProps) {
  const [observations, setObservations] = useState<PlantObservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        setLoading(true);
        const data = await getPlantObservations(latitude, longitude, radiusKm);
        
        // Filter by season if needed
        let filtered = data;
        if (currentSeasonOnly) {
          filtered = data.filter(obs => bloomsNow(obs));
        }
        
        setObservations(filtered);
      } catch (error) {
        console.error('Failed to fetch plant observations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [latitude, longitude, radiusKm, currentSeasonOnly]);

  if (loading || observations.length === 0) return null;

  return (
    <>
      {observations.map((obs) => {
        const distance = calculateDistance(latitude, longitude, obs.latitude, obs.longitude);
        
        return (
          <Marker
            key={obs.id}
            position={[obs.latitude, obs.longitude]}
            icon={createPlantIcon(obs.category)}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: '180px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-text)'
                }}>
                  {obs.name}
                </h4>
                <p style={{ 
                  margin: '0 0 6px 0', 
                  fontSize: '0.875rem',
                  color: 'var(--color-text-light)',
                  fontStyle: 'italic'
                }}>
                  {obs.scientificName}
                </p>
                <p style={{ 
                  margin: '0 0 4px 0', 
                  fontSize: '0.875rem',
                  color: 'var(--color-text)'
                }}>
                  <strong>Type:</strong> {obs.category === 'nectar' ? 'Nectar' : obs.category === 'pollen' ? 'Stuifmeel' : 'Overig'}
                </p>
                {showDistance && (
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '0.875rem',
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  }}>
                    Afstand: {distance.toFixed(2)} km
                  </p>
                )}
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.75rem',
                  color: 'var(--color-text-light)'
                }}>
                  Waarneming: {new Date(obs.date).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
