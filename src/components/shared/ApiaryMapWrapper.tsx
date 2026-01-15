import ApiaryMap from './ApiaryMap';

interface ApiaryMapWrapperProps {
  latitude: number;
  longitude: number;
}

export default function ApiaryMapWrapper({ latitude, longitude }: ApiaryMapWrapperProps) {
  return <ApiaryMap latitude={latitude} longitude={longitude} />;
}

