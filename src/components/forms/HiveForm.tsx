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
      } else {
        console.error('Failed to fetch hive data');
      }
    }
    fetchHive();
  }, [initialHive]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const hiveData = {
      name,
      type,
      colonyType,
      ...(!initialHive && apiaryId && { apiaryId: parseInt(apiaryId) }),
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
        : router.push(`/apiaries/${apiaryId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
      setLoading(false);
    }
  }

  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            {apiaryName ? (
              <h1 className="title">Nieuwe kast toevoegen</h1>
            ) : (
              <h1 className="title">Wijzig kastsoort of volk</h1>
            )}
            {apiaryName && (
              <p className="subtitle subtitle--centered">
                Voor bijenstand: {apiaryName}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="form">
            {error && (
              <div className="form-error form-error--general">
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <div className="form-group">
                <label htmlFor="name">Kastnaam *</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Bvb: Kast 1, Blauwe kast..."
                />
              </div>
              <label htmlFor="type" className="form-label">
                Type kast *
              </label>
              <select
                id="type"
                className="form-input"
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
            <div className="form-group">
              <label htmlFor="colonyType" className="form-label">
                Type volk *
              </label>
              <select
                id="colonyType"
                className="form-input"
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

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="button button--primary button--large"
              >
                {loading
                  ? initialHive
                    ? 'Bewerken...'
                    : 'Toevoegen...'
                  : initialHive
                  ? 'Kast Bewerken'
                  : 'Kast toevoegen'}
              </button>
              <Link
                href={`/apiaries/${apiaryId}`}
                className="button button--outline button--large"
              >
                Annuleren
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
