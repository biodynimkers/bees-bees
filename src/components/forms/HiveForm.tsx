'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { hiveSchema } from '@/lib/validators/schemas';
import { HIVE_TYPES, COLONY_TYPES } from '@/lib/hiveOptions';
import { de } from 'zod/locales';
//TODO loop over defined hive types and colony types to create options in the form

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
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
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
      setFieldErrors({ apiaryId: ['Selecteer eerst een bijenstand'] });
      setLoading(false);
      return;
    }
    const validationResult = hiveSchema.safeParse({
      type,
      name,
      colonyType,
      apiaryId: parseInt(finalApiaryId),
    });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
    }
    const hiveData = {
      name,
      type,
      colonyType,
      apiaryId: parseInt(finalApiaryId),
    };

    try {
      const url = initialHive ? `/api/hives/${initialHive}` : '/api/hives';
      const method = initialHive ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiveData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kon behuizing niet opslaan');
      }

      initialHive
        ? router.push(`/hives/${initialHive}`)
        : router.push(`/apiaries/${finalApiaryId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
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
          onChange={e => {
            setSelectedApiaryId(e.target.value);
            if (fieldErrors?.apiaryId) {
              setFieldErrors(prev => {
                if (!prev) return null;
                const { apiaryId, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
          required
        >
          <option value="">-- Selecteer bijenstand --</option>
          {apiaries.map(apiary => (
            <option key={apiary.id} value={apiary.id}>
              {apiary.name}
            </option>
          ))}
        </select>
        {fieldErrors?.apiaryId && (
          <span className="form-error">{fieldErrors.apiaryId[0]}</span>
        )}
      </div>

      <div className="form__group">
        <label htmlFor="name" className="form__label">
          Behuizing naam *
        </label>
        <input
          id="name"
          type="text"
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
          placeholder="Bvb: Behuizing 1, Blauwe behuizing..."
          required
        />
        {fieldErrors?.name && (
          <span className="form-error">{fieldErrors.name[0]}</span>
        )}
      </div>

      <div className="form__group">
        <label htmlFor="type" className="form__label">
          Type behuizing *
        </label>
        <select
          id="type"
          className="form__select"
          value={type}
          onChange={e => {
            setType(e.target.value);
            if (fieldErrors?.type) {
              setFieldErrors(prev => {
                if (!prev) return null;
                const { type, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
          required
        >
          <option value="">-- Selecteer type --</option>
          {HIVE_TYPES.map(hiveType => (
            <option key={hiveType} value={hiveType}>
              {hiveType}
            </option>
          ))}
        </select>
        {fieldErrors?.type && (
          <span className="form-error">{fieldErrors.type[0]}</span>
        )}
      </div>

      <div className="form__group">
        <label htmlFor="colonyType" className="form__label">
          Variëteit
        </label>
        <select
          id="colonyType"
          className="form__select"
          value={colonyType}
          onChange={e => {
            setColonyType(e.target.value);
            if (fieldErrors?.colonyType) {
              setFieldErrors(prev => {
                if (!prev) return null;
                const { name, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
          required
        >
          <option value="">-- Selecteer variëteit --</option>
          {COLONY_TYPES.map(colType => (
            <option key={colType} value={colType}>
              {colType}
            </option>
          ))}
        </select>
        {fieldErrors?.colonyType && (
          <span className="form-error">{fieldErrors.colonyType[0]}</span>
        )}
      </div>

      <div className="form__actions form__actions--center">
        <Link
          href={apiaryId ? `/apiaries/${apiaryId}` : '/apiaries'}
          className="btn btn--secondary btn--large"
        >
          Annuleren
        </Link>
        <button
          type="submit"
          className="btn btn--secondary btn--large"
          disabled={loading}
        >
          {loading
            ? initialHive
              ? 'Bezig met bewerken...'
              : 'Bezig met toevoegen...'
            : initialHive
              ? 'Behuizing Bewerken'
              : 'Behuizing toevoegen'}
        </button>
      </div>
    </form>
  );
}
