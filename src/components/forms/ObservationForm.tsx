'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import Timer from '@/components/shared/Timer';
import {
  newObservationSchema,
  updateObservationSchema,
} from '@/lib/validators/schemas';

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
  const [hives, setHives] = useState<
    Array<{ id: number; name: string; apiary: { name: string } }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
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

    // Frontend validatie met Zod
    const schema = initialObservation
      ? updateObservationSchema
      : newObservationSchema;
    const validationResult = schema.safeParse(observationData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
      setLoading(false);
      return;
    }

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
    <>
      <Timer />
      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="form-error form-error--general">
            <p>{error}</p>
          </div>
        )}
        {!hiveId && (
          <div className="form__group">
            <label htmlFor="hiveSelect" className="form__label">
              Kast *
            </label>
            <select
              id="hiveSelect"
              className="form__select"
              value={selectedHiveId}
              onChange={e => {
                setSelectedHiveId(e.target.value);
                if (fieldErrors?.hiveId) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { hiveId, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
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
        {hiveId && hiveName && (
          <div className="form__group">
            <label className="form__label">Kast</label>
            <input
              type="text"
              value={hiveName}
              className="form__input"
              disabled
              style={{
                backgroundColor: 'var(--color-gray-100)',
                cursor: 'not-allowed',
              }}
            />
          </div>
        )}
        <div className="form__group">
          <label htmlFor="beeCount" className="form__label">
            Aantal bijen *
          </label>
          <div className="bee-counter">
            <button
              type="button"
              className="bee-counter__button"
              onClick={() =>
                setBeeCount(prev =>
                  Math.max(0, parseInt(prev || '0') - 1).toString()
                )
              }
            >
              −1
            </button>
            <input
              type="number"
              id="beeCount"
              value={beeCount}
              onChange={e => {
                setBeeCount(e.target.value);
                if (fieldErrors?.beeCount) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { beeCount, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
              className="form__input bee-counter__input"
              placeholder="Geschat aantal bijen"
              required
              min="0"
            />
            <button
              type="button"
              className="bee-counter__button"
              onClick={() =>
                setBeeCount(prev => (parseInt(prev || '0') + 1).toString())
              }
            >
              +1
            </button>
          </div>
          <p className="form__help">
            Tel de bijen tijdens de 30 seconden observatie
          </p>
        </div>
        <div className="form__group">
          <label htmlFor="pollenColor" className="form__label">
            Stuifmeelkleur *
          </label>
          <input
            type="text"
            id="pollenColor"
            value={pollenColor}
            onChange={e => {
              setPollenColor(e.target.value);
              if (fieldErrors?.pollenColor) {
                setFieldErrors(prev => {
                  if (!prev) return null;
                  const { pollenColor, ...rest } = prev;
                  return Object.keys(rest).length ? rest : null;
                });
              }
            }}
            className="form__input"
            placeholder="bv. Geel, Oranje, Wit"
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="notes" className="form__label">
            Notities (optioneel)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="form__textarea"
            placeholder="Extra opmerkingen over de kast..."
            rows={4}
          />
        </div>
        <div className="form__actions">
          <button
            type="submit"
            className="btn btn--secondary btn--large"
            disabled={loading}
          >
            {loading
              ? 'Bezig met opslaan...'
              : initialObservation
              ? 'Observatie wijzigen'
              : 'Observatie toevoegen'}
          </button>
          <Link
            href={hiveId ? `/hives/${hiveId}` : '/observations'}
            className="btn btn--secondary btn--large"
          >
            Annuleren
          </Link>
        </div>
      </form>
    </>
  );
}
