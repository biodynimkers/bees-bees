// Waarnemingen.be API integration
// Separate file for easy removal if needed

export interface PlantObservation {
  id: string;
  name: string;
  scientificName: string;
  latitude: number;
  longitude: number;
  date: string;
  category: 'nectar' | 'pollen' | 'water' | 'other';
  observerName?: string;
  imageUrl?: string;
}

// Bee-friendly plant species IDs from waarnemingen.be
// These are plants that are valuable for bees (nectar/pollen sources)
const BEE_FRIENDLY_SPECIES = [
  // Trees
  'species/1000190', // Tilia (Linde)
  'species/1000191', // Salix (Wilg)
  'species/1000192', // Acer (Esdoorn)
  'species/1000193', // Castanea (Kastanje)
  
  // Flowers
  'species/1000194', // Trifolium pratense (Rode klaver)
  'species/1000195', // Lavandula (Lavendel)
  'species/1000196', // Helianthus (Zonnebloem)
  'species/1000197', // Calluna vulgaris (Heide)
];

// Get observations from waarnemingen.be API
export async function getPlantObservations(
  latitude: number,
  longitude: number,
  radiusKm: number = 7
): Promise<PlantObservation[]> {
  try {
    // Calculate bounding box from center point and radius
    const latDelta = radiusKm / 111; // 1 degree ≈ 111 km
    const lonDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));
    
    const minLat = latitude - latDelta;
    const maxLat = latitude + latDelta;
    const minLon = longitude - lonDelta;
    const maxLon = longitude + lonDelta;
    
    // Waarnemingen.be API endpoint
    // Note: This is a hypothetical API structure - need to verify actual API
    const apiUrl = `https://waarnemingen.be/api/v1/observations?` + 
      `min_lat=${minLat}&max_lat=${maxLat}&` +
      `min_lon=${minLon}&max_lon=${maxLon}&` +
      `species=${BEE_FRIENDLY_SPECIES.join(',')}&` +
      `limit=100`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        // Add API key if required: 'Authorization': 'Bearer YOUR_API_KEY'
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch observations from waarnemingen.be');
      return getDummyData(latitude, longitude);
    }
    
    const data = await response.json();
    
    // Transform API response to our format
    return data.observations?.map((obs: any) => ({
      id: obs.id?.toString() || Math.random().toString(),
      name: obs.species?.dutch_name || obs.species?.name || 'Onbekend',
      scientificName: obs.species?.scientific_name || '',
      latitude: obs.location?.latitude || latitude,
      longitude: obs.location?.longitude || longitude,
      date: obs.date || new Date().toISOString(),
      category: getPlantCategory(obs.species?.scientific_name || ''),
      observerName: obs.observer?.name,
      imageUrl: obs.images?.[0]?.url,
    })) || [];
    
  } catch (error) {
    console.error('Error fetching observations:', error);
    // Fallback to dummy data if API fails
    return getDummyData(latitude, longitude);
  }
}

// Dummy data fallback
function getDummyData(latitude: number, longitude: number): PlantObservation[] {
  return [
    {
      id: '1',
      name: 'Linde',
      scientificName: 'Tilia',
      latitude: latitude + 0.01,
      longitude: longitude + 0.01,
      date: '2025-06-15',
      category: 'nectar',
    },
    {
      id: '2',
      name: 'Rode klaver',
      scientificName: 'Trifolium pratense',
      latitude: latitude - 0.015,
      longitude: longitude + 0.02,
      date: '2025-07-20',
      category: 'nectar',
    },
    {
      id: '3',
      name: 'Wilg',
      scientificName: 'Salix',
      latitude: latitude + 0.02,
      longitude: longitude - 0.01,
      date: '2025-04-10',
      category: 'pollen',
    },
  ];
}

// Helper function to categorize plants by bee value
export function getPlantCategory(scientificName: string): 'nectar' | 'pollen' | 'water' | 'other' {
  const nectarPlants = ['Tilia', 'Trifolium', 'Lavandula', 'Helianthus', 'Calluna', 'Castanea'];
  const pollenPlants = ['Salix', 'Corylus', 'Populus', 'Acer'];
  
  if (nectarPlants.some(plant => scientificName.includes(plant))) return 'nectar';
  if (pollenPlants.some(plant => scientificName.includes(plant))) return 'pollen';
  
  return 'other';
}

