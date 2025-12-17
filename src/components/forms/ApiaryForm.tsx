'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ApiaryForm({
  initialApiary,
}: {
  initialApiary?: string;
}) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!initialApiary) return;
    async function fetchApiary() {
      const res = await fetch(`/api/apiaries/${initialApiary}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched apiary data:', data);
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
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
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

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Naam bijenstand *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="form-input"
          placeholder="bv. Tuin achteraan, Bij de beek"
          required
        />
      </div>

      <label>
        Latitude:
        <input
          type="number"
          id="latitude"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          step="any"
          required
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          id="longitude"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          step="any"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="button button--primary button--large"
      >
        {loading
          ? initialApiary
            ? 'Bewerken '
            : 'Toevoegen...'
          : initialApiary
          ? 'Bewerk bijenstand'
          : 'Bijenstand toevoegen'}
      </button>
    </form>
  );
}
