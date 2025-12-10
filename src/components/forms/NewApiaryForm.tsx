'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewApiaryForm() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [name, setName] = useState('');

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
      const response = await fetch('/api/apiaries', {
        method: 'POST',
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
        {loading ? 'Toevoegen...' : 'Bijenstand toevoegen'}
      </button>
    </form>
  );
}
