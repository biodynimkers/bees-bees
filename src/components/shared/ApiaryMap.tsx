'use client';

import { useRef, useState } from 'react';
import Map, { Marker, Layer, Source, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ApiaryMapProps {
  latitude: number;
  longitude: number;
  showFullscreen?: boolean;
}

export default function ApiaryMap({ latitude, longitude, showFullscreen = true }: ApiaryMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom: 14
  });

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

  const handleFullscreen = () => {
    const wrapper = document.getElementById('apiary-map-wrapper');
    if (wrapper) {
      if (!document.fullscreenElement) {
        wrapper.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="map-wrapper" id="apiary-map-wrapper" style={{ 
      position: 'relative',
      width: '100%', 
      height: '400px',
      minHeight: '400px'
    }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Zoom Controls */}
        <NavigationControl position="top-left" showCompass={false} />
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
      </Map>
      
      {showFullscreen && (
        <button 
          className="btn btn--secondary map-fullscreen-btn"
          onClick={handleFullscreen}
          type="button"
        >
          Fullscreen
        </button>
      )}
    </div>
  );
}
