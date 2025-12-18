'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

interface ObservationFormProps {
  hiveId?: string | undefined;
  hiveName?: string;
  initialObservation?: string;
}
export default function ObservationForm({
  hiveId,
  hiveName,
  initialObservation,
}: ObservationFormProps) {
  const [beeCount, setBeeCount] = useState('');
  const [pollenColor, setPollenColor] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedHiveId, setSelectedHiveId] = useState(hiveId || '');
  const [hives, setHives] = useState<Array<{id: number, name: string, apiary: {name: string}}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (!initialObservation) return;
    async function fetchHive() {
      const res = await fetch(`/api/observations/${initialObservation}`);
      if (res.ok) {
        const data = await res.json();
        setBeeCount(data.beeCount.toString());
        setPollenColor(data.pollenColor);
        setNotes(data.notes || '');
      } else {
        console.error('Failed to fetch hive data');
      }
    }
    fetchHive();
  }, [initialObservation]);

  // Fetch hives when no hiveId is provided
  useEffect(() => {
    if (!hiveId) {
      async function fetchHives() {
        try {
          const res = await fetch('/api/hives');
          if (res.ok) {
            const data = await res.json();
            setHives(data);
          }
        } catch (error) {
          console.error('Failed to fetch hives:', error);
        }
      }
      fetchHives();
    }
  }, [hiveId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const finalHiveId = hiveId || selectedHiveId;
    
    if (!finalHiveId) {
      setError('Selecteer eerst een kast');
      setLoading(false);
      return;
    }

    const observationData = {
      beeCount: parseInt(beeCount),
      pollenColor,
      notes: notes || null,
      ...(!initialObservation && { hiveId: parseInt(finalHiveId) }),
    };

    try {
      let response;
      const url = initialObservation
        ? `/api/observations/${initialObservation}`
        : '/api/observations';
      const method = initialObservation ? 'PUT' : 'POST';
      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(observationData),
      });

      if (!response.ok) throw new Error('Kon observatie niet aanmaken');

      router.push(`/hives/${finalHiveId}`);
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
            {hiveId && (
              <Link href={`/hives/${hiveId}`} className="breadcrumb">
                ← Terug naar kast
              </Link>
            )}
            {/* <h1 className="title">Nieuwe observatie</h1> */}
            {hiveName && (
              <p className="subtitle subtitle--centered">{hiveName}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            {!hiveId && (
              <div className="form-group">
                <label htmlFor="hiveSelect" className="form-label">
                  Kast *
                </label>
                <select
                  id="hiveSelect"
                  className="form-input"
                  value={selectedHiveId}
                  onChange={e => setSelectedHiveId(e.target.value)}
                  required
                >
                  <option value="">-- Selecteer kast --</option>
                  {hives.map(hive => (
                    <option key={hive.id} value={hive.id}>
                      {hive.apiary.name} - {hive.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="beeCount" className="form-label">
                Aantal bijen
              </label>
              <input
                type="number"
                id="beeCount"
                value={beeCount}
                onChange={e => setBeeCount(e.target.value)}
                className="form-input"
                placeholder="Geschat aantal bijen"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pollenColor" className="form-label">
                Stuifmeelkleur
              </label>
              <input
                type="text"
                id="pollenColor"
                value={pollenColor}
                onChange={e => setPollenColor(e.target.value)}
                className="form-input"
                placeholder="bv. Geel, Oranje, Wit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notities (optioneel)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="form-input"
                placeholder="Extra opmerkingen over de kast..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="button button--primary button--large"
              disabled={loading}
            >
              {loading
                ? initialObservation
                  ? 'Bezig met opslaan...'
                  : 'Bezig met opslaan...'
                : initialObservation
                ? 'Observatie wijzigen'
                : 'Observatie toevoegen'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}