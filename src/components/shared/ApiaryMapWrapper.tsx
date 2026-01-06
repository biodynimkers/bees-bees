'use client';

import dynamicImport from 'next/dynamic';

const ApiaryMap = dynamicImport(() => import('./ApiaryMap'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'var(--color-text-light)' 
    }}>
      Kaart laden...
    </div>
  )
});

interface ApiaryMapWrapperProps {
  latitude: number;
  longitude: number;
  apiaryName: string;
}

export default function ApiaryMapWrapper({ latitude, longitude, apiaryName }: ApiaryMapWrapperProps) {
  return <ApiaryMap latitude={latitude} longitude={longitude} apiaryName={apiaryName} />;
}
