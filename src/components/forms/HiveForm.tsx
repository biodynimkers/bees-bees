'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HiveForm({
  apiaryId,
  apiaryName,
  initialHive,
}: {
  apiaryId?: string | undefined;
  apiaryName?: string;
  initialHive?: string;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [colonyType, setColonyType] = useState('');
  const [selectedApiaryId, setSelectedApiaryId] = useState(apiaryId || '');
  const [apiaries, setApiaries] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!initialHive) return;
    async function fetchHive() {
      const res = await fetch(`/api/hives/${initialHive}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched hive data:', data);
        setName(data.name);
        setType(data.type);
        setColonyType(data.colonyType);
        // Set current apiary as default when editing
        setSelectedApiaryId(data.apiaryId?.toString() || '');
      } else {
        console.error('Failed to fetch hive data');
      }
    }
    fetchHive();
  }, [initialHive]);

  // Fetch all apiaries (always, for both creating and editing)
  useEffect(() => {
    async function fetchApiaries() {
      try {
        const res = await fetch('/api/apiaries');
        if (res.ok) {
          const data = await res.json();
          setApiaries(data);
        }
      } catch (error) {
        console.error('Failed to fetch apiaries:', error);
      }
    }
    fetchApiaries();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const finalApiaryId = apiaryId || selectedApiaryId;

    if (!finalApiaryId) {
      setError('Selecteer eerst een bijenstand');
      setLoading(false);
      return;
    }

    const hiveData = {
      name,
      type,
      colonyType,
      apiaryId: parseInt(finalApiaryId),
    };

    try {
      let response;
      const url = initialHive ? `/api/hives/${initialHive}` : '/api/hives';
      const method = initialHive ? 'PUT' : 'POST';
      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiveData),
      });

      if (!response.ok) throw new Error('Kon kast niet aanmaken');
      initialHive
        ? router.push(`/hives/${initialHive}`)
        : router.push(`/apiaries/${finalApiaryId}`);
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

      <div className="form__group">
        <label htmlFor="apiarySelect" className="form__label">
          Bijenstand *
        </label>
        <select
          id="apiarySelect"
          className="form__select"
          value={selectedApiaryId}
          onChange={e => setSelectedApiaryId(e.target.value)}
          required
        >
          <option value="">-- Selecteer bijenstand --</option>
          {apiaries.map(apiary => (
            <option key={apiary.id} value={apiary.id}>
              {apiary.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form__group">
        <label htmlFor="name" className="form__label">
          Kastnaam *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="form__input"
          placeholder="Bvb: Kast 1, Blauwe kast..."
          required
        />
      </div>

      <div className="form__group">
        <label htmlFor="type" className="form__label">
          Type kast *
        </label>
        <select
          id="type"
          className="form__select"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        >
          <option value="">-- Selecteer type --</option>
          <option value="Dadant">Dadant</option>
          <option value="Langstroth">Langstroth</option>
          <option value="Warré">Warré</option>
          <option value="Top Bar Hive">Top Bar Hive</option>
          <option value="Klokkast">Klokkast</option>
          <option value="Anders">Anders</option>
        </select>
      </div>

      <div className="form__group">
        <label htmlFor="colonyType" className="form__label">
          Type volk *
        </label>
        <select
          id="colonyType"
          className="form__select"
          value={colonyType}
          onChange={e => setColonyType(e.target.value)}
          required
        >
          <option value="">-- Selecteer volk --</option>
          <option value="Buckfast">Buckfast</option>
          <option value="Carnica">Carnica</option>
          <option value="Italiaanse bij">Italiaanse bij</option>
          <option value="Zwarte bij">Zwarte bij (Belgische)</option>
          <option value="Hybride">Hybride</option>
          <option value="Onbekend">Onbekend</option>
        </select>
      </div>

      <div className="form__actions">
        <button
          type="submit"
          className="btn btn--primary btn--large"
          disabled={loading}
        >
          {loading
            ? initialHive
              ? 'Bezig met bewerken...'
              : 'Bezig met toevoegen...'
            : initialHive
            ? 'Kast Bewerken'
            : 'Kast toevoegen'}
        </button>
        <Link
          href={apiaryId ? `/apiaries/${apiaryId}` : '/apiaries'}
          className="btn btn--secondary btn--large"
        >
          Annuleren
        </Link>
      </div>
    </form>
  );
}
