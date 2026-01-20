'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { apiarySchema } from '@/lib/validators/schemas';
import dynamic from 'next/dynamic';

const InteractiveApiaryMap = dynamic(() => import('./InteractiveApiaryMap'), {
  ssr: false,
});
export default function ApiaryForm({
  initialApiary,
}: {
  initialApiary?: string;
}) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [locationMethod, setLocationMethod] = useState<'address' | 'gps'>(
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'gps' : 'address',
  ); // preselectie op basis van apparaat
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  useEffect(() => {
    if (!initialApiary) return;
    async function fetchApiary() {
      const res = await fetch(`/api/apiaries/${initialApiary}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setLatitude(data.latitude.toString());
        setLongitude(data.longitude.toString());
      } else {
        console.error('Failed to fetch apiary data');
      }
    }
    fetchApiary();
  }, [initialApiary]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [geocodingError, setGeocodingError] = useState(''); // Adres-specifieke fouten
  const [gpsError, setGpsError] = useState(''); // GPS-specifieke fouten
  const router = useRouter();

  // Functie om huidige locatie op te halen
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocatie wordt niet ondersteund door deze browser');
      return;
    }

    setGpsError('');
    setGeocodingLoading(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setGpsError('');
        setGeocodingLoading(false);
        console.log('Locatie succesvol opgehaald:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      error => {
        setGeocodingLoading(false);
        let errorMessage = 'Kon locatie niet ophalen. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              'Toegang tot locatie is geweigerd. Geef toestemming in uw browser instellingen.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage +=
              'Locatie informatie is niet beschikbaar. Probeer het opnieuw.';
            break;
          case error.TIMEOUT:
            errorMessage +=
              'De aanvraag om uw locatie op te halen is verlopen. Probeer het opnieuw.';
            break;
          default:
            errorMessage += 'Er is een onbekende fout opgetreden.';
        }

        setError(errorMessage);
        console.error('Geolocation error:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // Reset fouten bij wisselen van methode
  const handleLocationMethodChange = (method: 'address' | 'gps') => {
    setLocationMethod(method);
    setGeocodingError('');
    setGpsError('');
  };

  // Functie om adres om te zetten naar coördinaten
  const geocodeAddress = async () => {
    if (!address.trim()) {
      setGeocodingError('Voer een geldig adres in');
      return;
    }

    setGeocodingLoading(true);
    setGeocodingError('');
    // Verwijder de  field errors wanneer de coördinaen successvol zijn opgehaald
    setFieldErrors(null);

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    try {
      let data;

      // Probeer eerst Mapbox als token beschikbaar is
      if (mapboxToken) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address,
          )}.json?country=BE,NL&limit=1&access_token=${mapboxToken}`,
        );

        const mapboxData = await response.json();

        if (mapboxData.features && mapboxData.features.length > 0) {
          const [lng, lat] = mapboxData.features[0].center;
          setLatitude(lat.toString());
          setLongitude(lng.toString());
          setGeocodingError('');
          setFieldErrors(null);
          return;
        }
      }

      // Fallback naar Nominatim als Mapbox niet beschikbaar is of geen resultaten geeft
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address,
        )}&countrycodes=be,nl&limit=1`,
        {
          headers: {
            'User-Agent': 'BeesApp/1.0',
          },
        },
      );

      data = await response.json();

      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
        setGeocodingError('');
      } else {
        setGeocodingError(
          'Adres niet gevonden. Probeer een meer specifiek adres (straat, nummer, stad).',
        );
      }
    } catch (err) {
      setGeocodingError(
        'Kon adres niet omzetten naar coördinaten. Probeer het opnieuw.',
      );
      console.error('Geocoding error:', err);
    } finally {
      setGeocodingLoading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setGeocodingError('');
    setLoading(true);

    // Valideer input met Zod
    const validationResult = apiarySchema.safeParse({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    // Check of gebruiker locatie heeft ingevuld via gekozen methode
    const hasLocationError =
      locationMethod === 'address' && (!latitude || !longitude);

    // Als er validatiefouten zijn OF locatiefouten, toon alles tegelijk
    if (!validationResult.success || hasLocationError) {
      if (!validationResult.success) {
        const { fieldErrors } = validationResult.error.flatten();
        setFieldErrors(fieldErrors);
      }
      if (hasLocationError) {
        setGeocodingError('Vul een adres in en klik op "Zoek locatie".');
      }
      setLoading(false);
      return;
    }
    const apiaryData = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      let response;
      const url = initialApiary
        ? `/api/apiaries/${initialApiary}`
        : '/api/apiaries';
      let method = initialApiary ? 'PUT' : 'POST';
      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiaryData),
      });

      if (!response.ok) throw new Error('Kon bijenstand niet aanmaken');
      router.push(`/apiaries`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
      setFieldErrors({}); // reset veldfouten in geval van algemene fout
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && (
        <div className="form-error form-error--general">
          <p>{error}</p>
        </div>
      )}

      <div className="form__group">
        <label htmlFor="name" className="form__label">
          Naam bijenstand *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (fieldErrors?.name) {
              setFieldErrors(prev => {
                if (!prev) return null;
                const { name, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
          className="form__input"
          placeholder="bv. Tuin achteraan, Bij de beek"
          required
        />
        {fieldErrors?.name && (
          <span className="form-error">{fieldErrors.name[0]}</span>
        )}
      </div>
      {/* Locatie methode selectie */}
      <div className="form__group">
        <label className="form__label">Locatie bepalen via:</label>
        <div className="form__radio-group">
          <label className="form__radio">
            <input
              type="radio"
              name="locationMethod"
              value="gps"
              checked={locationMethod === 'gps'}
              onChange={() => handleLocationMethodChange('gps')}
            />
            Huidige locatie gebruiken (aanbevolen op mobiel)
          </label>
          <label className="form__radio">
            <input
              type="radio"
              name="locationMethod"
              value="address"
              checked={locationMethod === 'address'}
              onChange={() => handleLocationMethodChange('address')}
            />
            Adres invoeren (bij benadering)
          </label>
        </div>
        <p className="form__help">
          Voor nauwkeurige locaties van bijenbehuizingen in velden of bossen,
          gebruik GPS op uw smartphone.
        </p>
      </div>
      {/* Adres invoer */}
      {locationMethod === 'address' && (
        <div className="form__group">
          <label htmlFor="address" className="form__label">
            Adres *
          </label>
          <div className="form__input-group">
            <input
              type="text"
              id="address"
              value={address}
              onChange={e => {
                setAddress(e.target.value);
                if (geocodingError) setGeocodingError('');
                if (fieldErrors?.address) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { address, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
              className="form__input"
              placeholder="Straat nummer, Stad"
              required
            />
            <button
              type="button"
              onClick={geocodeAddress}
              disabled={geocodingLoading || !address.trim()}
              className="btn btn--secondary"
            >
              {geocodingLoading ? 'Zoeken...' : 'Zoek locatie'}
            </button>
          </div>

          {geocodingError && (
            <p
              style={{
                marginTop: '0.5rem',
                color: '#dc3545',
                fontSize: '0.875rem',
              }}
            >
              {geocodingError}
            </p>
          )}

          {!geocodingError && (
            <p className="form__help">
              Voer uw volledige adres in en klik op "Zoek locatie"
            </p>
          )}
        </div>
      )}
      {/* GPS locatie */}
      {locationMethod === 'gps' && (
        <div className="form__group">
          <label className="form__label">GPS Locatie</label>
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              color: '#856404',
            }}
          >
            <strong> Belangrijk:</strong> Deze functie werkt alleen nauwkeurig
            op smartphones met GPS. Desktop computers gebruiken WiFi/IP-locatie
            en zijn niet geschikt voor het bepalen van bijenbehuizingen in
            velden of bossen.
            <br />
            <strong>Gebruik uw smartphone voor beste resultaten.</strong>
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="btn btn--secondary"
            disabled={geocodingLoading}
          >
            {geocodingLoading
              ? 'Locatie ophalen...'
              : 'Huidige locatie ophalen'}
          </button>

          {gpsError && (
            <p
              style={{
                marginTop: '0.5rem',
                color: '#dc3545',
                fontSize: '0.875rem',
              }}
            >
              {gpsError}
            </p>
          )}

          {!gpsError && (
            <p className="form__help">
              Klik om uw huidige GPS-locatie te gebruiken. Zorg ervoor dat u
              toestemming geeft in uw browser.
            </p>
          )}
        </div>
      )}
      {/* Coördinaten weergave (alleen-lezen) */}
      {latitude && longitude && (
        <div className="form__group">
          <label className="form__label">Gevonden locatie:</label>
          <div className="form__coordinates">
            <span>Lat: {parseFloat(latitude).toFixed(6)}</span>
            <span>Lng: {parseFloat(longitude).toFixed(6)}</span>
          </div>
          {(fieldErrors?.latitude || fieldErrors?.longitude) && (
            <span className="form-error">
              {fieldErrors?.latitude?.[0] || fieldErrors?.longitude?.[0]}
            </span>
          )}
        </div>
      )}

      {/* Interactieve kaart voor fine-tuning */}
      {latitude && longitude && (
        <InteractiveApiaryMap
          latitude={parseFloat(latitude)}
          longitude={parseFloat(longitude)}
          onLocationChange={(lat, lng) => {
            setLatitude(lat.toString());
            setLongitude(lng.toString());
            // Wissel naar GPS methode bij handmatige aanpassing
            setLocationMethod('gps');
          }}
        />
      )}

      <div className="form__actions form__actions--center">
        <Link href="/apiaries" className="btn btn--secondary btn--large">
          Annuleren
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn btn--secondary btn--large"
        >
          {loading
            ? initialApiary
              ? 'Bewerken...'
              : 'Toevoegen...'
            : initialApiary
              ? 'Bewerk bijenstand'
              : 'Bijenstand toevoegen'}
        </button>
      </div>
    </form>
  );
}
