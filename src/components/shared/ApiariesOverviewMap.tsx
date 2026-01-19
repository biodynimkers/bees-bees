'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Apiary {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  _count?: {
    hives: number;
  };
}

interface ApiariesOverviewMapProps {
  apiaries: Apiary[];
}

export default function ApiariesOverviewMap({ apiaries }: ApiariesOverviewMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const mapRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Bereken center en zoom level op basis van alle apiaries
  const calculateCenter = () => {
    if (apiaries.length === 0) {
      return { longitude: 4.4024, latitude: 51.2194, zoom: 8 }; // België center
    }
    
    if (apiaries.length === 1) {
      return {
        longitude: apiaries[0].longitude,
        latitude: apiaries[0].latitude,
        zoom: 12
      };
    }

    // Bereken bounds
    const lats = apiaries.map(a => a.latitude);
    const lngs = apiaries.map(a => a.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Simpele zoom berekening op basis van spread
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    let zoom = 12;
    if (maxDiff > 1) zoom = 8;
    else if (maxDiff > 0.5) zoom = 9;
    else if (maxDiff > 0.2) zoom = 10;
    else if (maxDiff > 0.1) zoom = 11;
    
    return { longitude: centerLng, latitude: centerLat, zoom };
  };

  const initialView = calculateCenter();
  const [viewState, setViewState] = useState(initialView);
  const [selectedApiary, setSelectedApiary] = useState<Apiary | null>(null);

  const handleFullscreenToggle = () => {
    const wrapper = document.getElementById('apiaries-overview-map-wrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(err => {
        // Silent fail - fullscreen may not be supported
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (apiaries.length === 0) {
    return (
      <div className="card" style={{ 
        padding: 'var(--space-10)', 
        textAlign: 'center',
        background: 'var(--color-gray-50)'
      }}>
        <p style={{ color: 'var(--color-text-light)' }}>
          Geen bijenstanden om weer te geven op de kaart
        </p>
      </div>
    );
  }

  return (
    <div 
      id="apiaries-overview-map-wrapper"
      className="map-wrapper"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '500px',
        minHeight: '500px'
      }}
    >
      <style jsx global>{`
        .mapboxgl-popup-close-button {
          font-size: 24px !important;
          width: 32px !important;
          height: 32px !important;
          padding: 4px !important;
          line-height: 1 !important;
        }
      `}</style>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Fullscreen Control */}
        <div style={{
          position: 'absolute',
          top: '78px',
          right: '10px',
          zIndex: 1
        }}>
          <button
            onClick={handleFullscreenToggle}
            className="mapboxgl-ctrl mapboxgl-ctrl-group"
            type="button"
            title={isFullscreen ? 'Verlaat volledig scherm' : 'Volledig scherm'}
            style={{
              width: '29px',
              height: '29px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333'
            }}
          >
            {isFullscreen ? '⊡' : '⛶'}
          </button>
        </div>

        {apiaries.map((apiary) => (
          <Marker
            key={apiary.id}
            longitude={apiary.longitude}
            latitude={apiary.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedApiary(apiary);
            }}
          >
            <div className="map-marker">
              <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
                <path
                  d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.716 23.284 0 15 0z"
                  fill="#FF6B00"
                />
                <circle cx="15" cy="15" r="8" fill="white" />
              </svg>
            </div>
          </Marker>
        ))}

        {selectedApiary && (
          <Popup
            longitude={selectedApiary.longitude}
            latitude={selectedApiary.latitude}
            anchor="top"
            onClose={() => setSelectedApiary(null)}
            closeButton={true}
            closeOnClick={false}
            offset={20}
            maxWidth="320px"
          >
            <div style={{ padding: '1rem' }}>
              <h4 style={{ 
                fontSize: '1.05rem', 
                fontWeight: 600,
                marginBottom: '0.85rem',
                color: '#1a1a1a'
              }}>
                {selectedApiary.name}
              </h4>
              
              <div style={{ 
                marginBottom: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e5e5e5'
              }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#666',
                  marginBottom: '0.25rem'
                }}>
                  Aantal behuizingen
                </p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}>
                  {selectedApiary._count?.hives || 0} {selectedApiary._count?.hives === 1 ? 'behuizing' : 'behuizingen'}
                </p>
              </div>

              <a
                href={`/apiaries/${selectedApiary.id}`}
                style={{
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 'var(--border-radius)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                }}
              >
                Bekijk details →
              </a>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map info overlay */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--border-radius)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontSize: '0.875rem',
          fontWeight: 500,
          zIndex: 1,
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        {apiaries.length} {apiaries.length === 1 ? 'locatie' : 'locaties'}
      </div>
    </div>
  );
}
