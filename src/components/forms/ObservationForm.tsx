'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { set } from 'zod';

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const observationData = {
      beeCount: parseInt(beeCount),
      pollenColor,
      notes: notes || null,
      ...(!initialObservation && hiveId && { hiveId: parseInt(hiveId) }),
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

      router.push(`/hives/${hiveId}`);
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
            <Link href={`/hives/${hiveId}`} className="breadcrumb">
              ← Terug naar kast
            </Link>
            {/* <h1 className="title">Nieuwe observatie</h1> */}
            <p className="subtitle subtitle--centered">{hiveName}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

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
