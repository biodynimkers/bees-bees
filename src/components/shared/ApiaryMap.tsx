'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Marker, Layer, Source, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DRACHT_PLANTS } from './DrachtkalenderSection';

interface GbifOccurrence {
  key: number;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
  species?: string;
  eventDate?: string;
  recordedBy?: string;
  vernacularName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  basisOfRecord?: string;
  individualCount?: number;
}

interface ApiaryMapProps {
  latitude: number;
  longitude: number;
  showGbifData?: boolean;
}

export default function ApiaryMap({ 
  latitude, 
  longitude, 
  showGbifData = false
}: ApiaryMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom: 14
  });
  const [occurrences, setOccurrences] = useState<GbifOccurrence[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<GbifOccurrence | null>(null);
  const [gbifLoading, setGbifLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter alleen planten
  const plantOccurrences = occurrences.filter(occ => occ.kingdom === 'Plantae');

  // Check bloom status using drachtkalender data
  const isInBloom = (occ: GbifOccurrence): boolean => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // Try to match with drachtkalender by scientific name
    const matchedPlant = DRACHT_PLANTS.find(plant => {
      if (!plant.scientificName || !occ.scientificName) return false;
      const plantSci = plant.scientificName.toLowerCase();
      const occSci = occ.scientificName.toLowerCase();
      // Match if either contains the other (e.g., "Malus" matches "Malus domestica")
      return occSci.includes(plantSci) || plantSci.includes(occSci);
    });

    if (matchedPlant) {
      // Use drachtkalender bloom period
      if (matchedPlant.startMonth <= matchedPlant.endMonth) {
        return currentMonth >= matchedPlant.startMonth && currentMonth <= matchedPlant.endMonth;
      } else {
        // Overwinter period
        return currentMonth >= matchedPlant.startMonth || currentMonth <= matchedPlant.endMonth;
      }
    }

    // Default fallback: general bloom season (April-September)
    return currentMonth >= 4 && currentMonth <= 9;
  };

  // Fetch GBIF data
  useEffect(() => {
    if (!showGbifData) return;

    async function fetchGbifData() {
      try {
        setGbifLoading(true);
        const latMin = latitude - 0.05;
        const latMax = latitude + 0.05;
        const lngMin = longitude - 0.05;
        const lngMax = longitude + 0.05;
        const currentYear = new Date().getFullYear();
        
        // Gebruik GBIF zonder dataset filter om ALLE planten te krijgen (inheems en niet-inheems)
        const url = `https://api.gbif.org/v1/occurrence/search?kingdom=Plantae&year=${currentYear}&decimalLatitude=${latMin},${latMax}&decimalLongitude=${lngMin},${lngMax}&limit=300&country=BE`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setOccurrences(data.results || []);
        }
      } catch (err) {
        console.error('GBIF API error:', err);
      } finally {
        setGbifLoading(false);
      }
    }

    fetchGbifData();
  }, [showGbifData, latitude, longitude]);

  // Create circle features for 200m, 2km, 7km
  const createCircle = (radius: number) => {
    const points = 64;
    const coords = [];
    const distanceX = radius / (111320 * Math.cos(latitude * Math.PI / 180));
    const distanceY = radius / 110574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coords.push([longitude + x, latitude + y]);
    }
    coords.push(coords[0]);

    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: coords
      },
      properties: {}
    };
  };

  const circle200m = createCircle(200);
  const circle2km = createCircle(2000);
  const circle7km = createCircle(7000);

  const handleFullscreenToggle = () => {
    const wrapper = document.getElementById('apiary-map-wrapper');
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
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

  return (
    <div className="map-wrapper" id="apiary-map-wrapper" style={{ 
      position: 'relative',
      width: '100%', 
      height: '600px',
      minHeight: '600px'
    }}>
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
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Zoom Controls */}
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
        
        {/* 200m circle - red */}
        <Source id="circle-200m" type="geojson" data={circle200m}>
          <Layer
            id="circle-200m-layer"
            type="line"
            paint={{
              'line-color': '#FF0000',
              'line-width': 2,
              'line-opacity': 0.8
            }}
          />
        </Source>

        {/* 2km circle - blue */}
        <Source id="circle-2km" type="geojson" data={circle2km}>
          <Layer
            id="circle-2km-layer"
            type="line"
            paint={{
              'line-color': '#0000FF',
              'line-width': 2,
              'line-opacity': 0.8
            }}
          />
        </Source>

        {/* 7km circle - purple */}
        <Source id="circle-7km" type="geojson" data={circle7km}>
          <Layer
            id="circle-7km-layer"
            type="line"
            paint={{
              'line-color': '#800080',
              'line-width': 2,
              'line-opacity': 0.8
            }}
          />
        </Source>

        {/* Apiary marker */}
        <Marker longitude={longitude} latitude={latitude}>
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

        {/* GBIF waarnemingen markers - alleen planten */}
        {showGbifData && plantOccurrences.map((occ) => (
          <Marker
            key={occ.key}
            latitude={occ.decimalLatitude}
            longitude={occ.decimalLongitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedOccurrence(occ);
            }}
          >
            <div
              title={occ.vernacularName || occ.scientificName}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: isInBloom(occ) ? '#ff1493' : '#00ff00',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Marker>
        ))}

        {/* Popup voor geselecteerde waarneming */}
        {selectedOccurrence && (
          <Popup
            latitude={selectedOccurrence.decimalLatitude}
            longitude={selectedOccurrence.decimalLongitude}
            onClose={() => setSelectedOccurrence(null)}
            closeButton={true}
            closeOnClick={false}
            offset={10}
            maxWidth="320px"
          >
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '0.85rem',
              }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: isInBloom(selectedOccurrence) ? '#ff1493' : '#00ff00',
                  borderRadius: '50%',
                  flexShrink: 0,
                }} />
                <h4 style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 'bold', 
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: 1.3,
                }}>
                  {selectedOccurrence.scientificName}
                </h4>
              </div>

              {selectedOccurrence.vernacularName && (
                <p style={{ 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                }}>
                  {selectedOccurrence.vernacularName}
                </p>
              )}

              <div style={{ 
                fontSize: '0.9rem', 
                color: '#555',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: isInBloom(selectedOccurrence) ? '#ffe4f1' : '#f5f5dc',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: isInBloom(selectedOccurrence) ? '#c2185b' : '#006600',
                  border: `2px solid ${isInBloom(selectedOccurrence) ? '#ff1493' : '#00ff00'}`,
                }}>
                  {isInBloom(selectedOccurrence) ? 'In bloei' : 'Niet in bloei'}
                </div>

                {selectedOccurrence.family && (
                  <p style={{ margin: 0 }}>
                    <strong>Familie:</strong> {selectedOccurrence.family}
                  </p>
                )}

                {selectedOccurrence.class && (
                  <p style={{ margin: 0 }}>
                    <strong>Klasse:</strong> {selectedOccurrence.class}
                  </p>
                )}

                {selectedOccurrence.eventDate && (
                  <p style={{ margin: 0 }}>
                    <strong>Waargenomen:</strong>{' '}
                    {new Date(selectedOccurrence.eventDate).toLocaleDateString('nl-BE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>

              <a
                href={`https://www.gbif.org/occurrence/${selectedOccurrence.key}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#FF6B00',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
              >
                Bekijk waarneming →
              </a>
            </div>
          </Popup>
        )}
      </Map>
      
      {showGbifData && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '10px',
          backgroundColor: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          fontSize: '0.9rem',
          zIndex: 1,
        }}>
          {gbifLoading ? (
            <div style={{ textAlign: 'center' }}>Planten laden...</div>
          ) : (
            <>
              <div style={{ marginBottom: '10px', fontWeight: '600', fontSize: '1rem' }}>
                {plantOccurrences.length} Planten in de buurt
              </div>
              
              <div style={{ 
                fontSize: '0.85rem', 
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingTop: '10px',
                borderTop: '1px solid #ddd',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#ff1493', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  <span>In bloei</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#00ff00', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  <span>Niet in bloei</span>
                </div>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px' }}>
                Klik op een punt voor details
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
