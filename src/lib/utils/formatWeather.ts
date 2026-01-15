export function formatWeatherCondition(weatherCondition: string | null | undefined): string {
  switch (weatherCondition) {
    case 'SUNNY':
      return '☀️ Zonnig';
    case 'PARTLY_CLOUDY':
      return '⛅ Half bewolkt';
    case 'CLOUDY':
      return '☁️ Bewolkt';
    case 'RAINY':
      return '🌧️ Regenachtig';
    default:
      return '-';
  }
}

export function formatTemperature(temperature: number | null | undefined): string {
  if (temperature === null || temperature === undefined) {
    return '-';
  }
  return `${temperature}°C`;
}