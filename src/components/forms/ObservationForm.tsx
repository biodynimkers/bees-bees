'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Timer from '@/components/shared/Timer';
import ColorPicker from './ColorPicker';
import {
  newObservationSchema,
  updateObservationSchema,
} from '@/lib/validators/schemas';
import { pollenColors } from '@/lib/pollenColors';

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
  const [tooManyBees, setTooManyBees] = useState(false);
  const [pollenColor, setPollenColor] = useState('');
  const [pollenAmount, setPollenAmount] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [temperature, setTemperature] = useState<number | ''>(20);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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
    async function fetchObservation() {
      const res = await fetch(`/api/observations/${initialObservation}`);
      if (res.ok) {
        const data = await res.json();
        if (data.beeCount === -1) {
          setBeeCount('');
          setTooManyBees(true);
        } else {
          setBeeCount(data.beeCount.toString());
          setTooManyBees(false);
        }

        // Handle pollen color - convert string back to array
        const pollenColorString = data.pollenColor || '';
        const colorsArray = pollenColorString
          .split(', ')
          .filter((color: string) => color.trim() !== '');
        setSelectedColors(colorsArray);
        // Don't set pollenColor here - let useEffect handle it

        setPollenAmount(data.pollenAmount || '');
        setWeatherCondition(data.weatherCondition || '');
        setTemperature(data.temperature?.toString() || '');
        setNotes(data.notes || '');
      } else {
        console.error('Failed to fetch observation data');
      }
    }
    fetchObservation();
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

  // Sync selectedColors with pollenColor
  useEffect(() => {
    setPollenColor(selectedColors.join(', '));
  }, [selectedColors]);

  const handleColorToggle = (hex: string) => {
    const isNoPollenOption = pollenColors.find(
      color => color.hex === hex
    )?.isNoPollenOption;

    setSelectedColors(prev => {
      if (isNoPollenOption) {
        // If selecting "no pollen", clear all other selections
        return prev.includes(hex) ? [] : [hex];
      } else {
        // If selecting a regular color, remove "no pollen" if present and handle normally
        const filteredPrev = prev.filter(
          color => !pollenColors.find(c => c.hex === color)?.isNoPollenOption
        );

        if (filteredPrev.includes(hex)) {
          // Remove color
          return filteredPrev.filter(color => color !== hex);
        } else if (filteredPrev.length < 3) {
          // Add color
          return [...filteredPrev, hex];
        }
        return filteredPrev;
      }
    });

    // Clear field errors if any
    if (fieldErrors?.pollenColor) {
      setFieldErrors(prev => {
        if (!prev) return null;
        const { pollenColor, ...rest } = prev;
        return Object.keys(rest).length ? rest : null;
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const finalHiveId = hiveId || selectedHiveId;

    if (!finalHiveId) {
      setError('Selecteer eerst een behuizing');
      setLoading(false);
      return;
    }

    // Check required fields
    if (!tooManyBees && (!beeCount || parseInt(beeCount) === 0)) {
      setError('Voer een aantal bijen in of selecteer "Te veel om te tellen"');
      setLoading(false);
      return;
    }

    if (selectedColors.length === 0) {
      setError('Selecteer tenminste één stuifmeelkleur');
      setLoading(false);
      return;
    }

    const observationData = {
      beeCount: tooManyBees ? -1 : parseInt(beeCount),
      pollenColor,
      pollenAmount,
      weatherCondition,
      temperature: temperature ? temperature : null,
      notes: notes || '',
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
      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="form-error form-error--general">
            <p>{error}</p>
          </div>
        )}
        {!hiveId && (
          <div className="form__group">
            <label htmlFor="hiveSelect" className="form__label">
              Behuizing *
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
              <option value="">-- Selecteer behuizing --</option>
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
            <label className="form__label">Behuizing</label>
            <input
              type="text"
              value={hiveName}
              className="form__input"
              disabled
            />
          </div>
        )}
        <div className="form__section">
        <div className="form__group">
          <h3 className="form__section-title"><span className="form__step-badge">Stap 1</span> Aantal bijen</h3>
          <p className="form__instructions">
            Druk op 'Start timer' en tel 30 seconden lang hoeveel bijen er
            binnenkomen in de behuizing.
          </p>
          <Timer />
          <label htmlFor="beeCount" className="form__label">
            Aantal bijen *
          </label>
          <div className="bee-counter">
            <div className="bee-counter__controls">
              <button
                type="button"
                className="bee-counter__button bee-counter__button--mobile-only"
                disabled={tooManyBees}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setBeeCount(prev => {
                    const newValue = Math.max(
                      0,
                      parseInt(prev || '0') - 1
                    ).toString();
                    return newValue;
                  });
                }}
              >
                −1
              </button>
              <button
                type="button"
                className="bee-counter__button bee-counter__button--mobile-only"
                disabled={tooManyBees}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setBeeCount(prev => {
                    const newValue = (parseInt(prev || '0') + 1).toString();
                    return newValue;
                  });
                }}
              >
                +1
              </button>
            </div>
            <input
              type="number"
              id="beeCount"
              value={beeCount}
              disabled={tooManyBees}
              onChange={e => {
                const value = e.target.value;
                // Only allow numbers (and empty string for clearing)
                if (value === '' || /^\d+$/.test(value)) {
                  setBeeCount(value);
                  if (fieldErrors?.beeCount) {
                    setFieldErrors(prev => {
                      if (!prev) return null;
                      const { beeCount, ...rest } = prev;
                      return Object.keys(rest).length ? rest : null;
                    });
                  }
                }
              }}
              onKeyDown={e => {
                // Allow navigation, editing keys and keyboard shortcuts
                if (
                  [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'Escape',
                    'Enter',
                    'ArrowLeft',
                    'ArrowRight',
                    'Home',
                    'End',
                  ].includes(e.key) ||
                  e.ctrlKey ||
                  e.metaKey ||
                  /[0-9]/.test(e.key)
                ) {
                  return; // Allow these keys
                }
                e.preventDefault(); // Block everything else
              }}
              className="form__input bee-counter__input"
              placeholder={
                tooManyBees ? 'Te veel om te tellen' : 'Geschat aantal bijen'
              }
              required
              inputMode="numeric"
            />
          </div>
          <label className="form__checkbox-label">
            <input
              type="checkbox"
              checked={tooManyBees}
              onChange={e => {
                setTooManyBees(e.target.checked);
                if (e.target.checked) {
                  setBeeCount(''); // Clear input when too many is selected
                }
              }}
              className="form__checkbox"
            />
            Te veel bijen om te tellen
          </label>
          <p className="form__help">
            Tel de bijen tijdens de 30 seconden observatie
          </p>
        </div>
        </div>
        <div className="form__section">
        <div className="form__group">
          <h3 className="form__section-title"><span className="form__step-badge">Stap 2</span> Stuifmeelkleur</h3>
          <p className="form__instructions">
            Neem even de tij om de stuifmeelkleuren op de bijen te observeren.
            Selecteer maximaal 3 verschillende kleuren, of kies 'Geen' indien
            geen stuifmeel zichtbaar is.
          </p>
          <label className="form__label">Stuifmeelkleur *</label>
          <ColorPicker
            pollenColors={pollenColors}
            selectedColors={selectedColors}
            onColorToggle={handleColorToggle}
            maxColors={3}
          />
          {fieldErrors?.pollenColor && (
            <div className="form-error">
              {fieldErrors.pollenColor.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
          <input type="hidden" name="pollenColor" value={pollenColor} />
        </div>
        <div className="form__group">
          <label className="form__label">Hoeveelheid stuifmeel *</label>
          <p className="form__instructions">
            Geef aan hoeveel stuifmeel je gemiddeld op de bijen ziet.
          </p>
          <div className="form__radio-group">
            <button
              type="button"
              className={`btn ${pollenAmount === 'WEINIG' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setPollenAmount('WEINIG');
                if (fieldErrors?.pollenAmount) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { pollenAmount, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              Weinig
            </button>
            <button
              type="button"
              className={`btn ${pollenAmount === 'GEMIDDELD' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setPollenAmount('GEMIDDELD');
                if (fieldErrors?.pollenAmount) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { pollenAmount, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              Gemiddeld
            </button>
            <button
              type="button"
              className={`btn ${pollenAmount === 'VEEL' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setPollenAmount('VEEL');
                if (fieldErrors?.pollenAmount) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { pollenAmount, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              Veel
            </button>
          </div>
          {fieldErrors?.pollenAmount && (
            <div className="form-error">
              {fieldErrors.pollenAmount.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
          <input type="hidden" name="pollenAmount" value={pollenAmount} />
        </div>
        </div>
        <div className="form__section">
        <div className="form__group">
          <h3 className="form__section-title"><span className="form__step-badge">Stap 3</span> Weersomstandigheden</h3>
          <p className="form__instructions">
            Noteer de weersomstandigheden tijdens de observatie voor betere
            context.
          </p>
          <label className="form__label">Weersomstandigheden *</label>
          <div className="form__radio-group">
            <button
              type="button"
              className={`btn ${weatherCondition === 'SUNNY' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setWeatherCondition('SUNNY');
                if (fieldErrors?.weatherCondition) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { weatherCondition, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              ☀️ Zonnig
            </button>
            <button
              type="button"
              className={`btn ${weatherCondition === 'PARTLY_CLOUDY' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setWeatherCondition('PARTLY_CLOUDY');
                if (fieldErrors?.weatherCondition) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { weatherCondition, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              ⛅ Half bewolkt
            </button>
            <button
              type="button"
              className={`btn ${weatherCondition === 'CLOUDY' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setWeatherCondition('CLOUDY');
                if (fieldErrors?.weatherCondition) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { weatherCondition, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              ☁️ Bewolkt
            </button>
            <button
              type="button"
              className={`btn ${weatherCondition === 'RAINY' ? 'btn--primary' : 'btn--secondary'}`}
              onClick={() => {
                setWeatherCondition('RAINY');
                if (fieldErrors?.weatherCondition) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { weatherCondition, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
            >
              🌧️ Regenachtig
            </button>
          </div>
          {fieldErrors?.weatherCondition && (
            <div className="form-error">
              {fieldErrors.weatherCondition.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}

          <label htmlFor="temperature" className="form__label" style={{ marginTop: 'var(--s-4)' }}>
            Temperatuur (optioneel)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <input
              type="number"
              id="temperature"
              value={temperature}
              onChange={e => {
                setTemperature(
                  e.target.value === '' ? '' : Number(e.target.value)
                );
                if (fieldErrors?.temperature) {
                  setFieldErrors(prev => {
                    if (!prev) return null;
                    const { temperature, ...rest } = prev;
                    return Object.keys(rest).length ? rest : null;
                  });
                }
              }}
              className="form__input"
              placeholder="20"
              min="-20"
              max="50"
              step="0.5"
              style={{ width: '120px' }}
            />
            <span>°C</span>
          </div>
          {fieldErrors?.temperature && (
            <div className="form-error">
              {fieldErrors.temperature.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
          <input
            type="hidden"
            name="weatherCondition"
            value={weatherCondition}
          />
          <input type="hidden" name="temperature" value={temperature} />
        </div>
        </div>
        <div className="form__section">
        <div className="form__group">
          <h3 className="form__section-title"><span className="form__step-badge">Stap 4</span> Aanvullende observaties</h3>
          <p className="form__instructions">
            Noteer eventuele bijzonderheden die je tijdens de observatie hebt
            opgemerkt.
          </p>
          <label htmlFor="notes" className="form__label">
            Notities (optioneel)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="form__textarea"
            placeholder="Extra opmerkingen over de behuizing..."
            rows={4}
          />
          {fieldErrors?.notes && (
            <div className="form-error">
              {fieldErrors.notes.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
        </div>
        </div>
        <div className="form__actions form__actions--center">
          <Link
            href={hiveId ? `/hives/${hiveId}` : '/observations'}
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
              ? 'Bezig met opslaan...'
              : initialObservation
              ? 'Waarneming bewerken'
              : 'Waarneming toevoegen'}
          </button>
        </div>
      </form>
    </>
  );
}
