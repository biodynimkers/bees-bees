'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordFormSchema } from '@/lib/validators/schemas';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Check if token is present on mount
  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(null);
    setFieldErrors(null);
    setLoading(true);

    if (!token) {
      setErrors('Geen geldige reset token gevonden.');
      setLoading(false);
      return;
    }

    // Validate input
    const validationResult = resetPasswordFormSchema.safeParse({
      password,
      confirmPassword,
    });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: validationResult.data.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Clear form
        setPassword('');
        setConfirmPassword('');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setErrors(data.error || 'Er ging iets mis. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  // Show error if no token
  if (tokenError) {
    return (
      <>
        <section className="page-header" data-page="—">
          <div className="container">
            <h1 className="heading-primary">Ongeldige reset link</h1>
            <p className="page-header__subtitle">
              Deze reset link is ongeldig of verlopen
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <div className="card">
              <div className="card__content" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--space-6)',
                    color: 'var(--color-error)',
                  }}
                >
                  ✕
                </div>
                <h2
                  className="heading-secondary"
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  Reset link ongeldig
                </h2>
                <p
                  className="card__description"
                  style={{ marginBottom: 'var(--space-6)' }}
                >
                  Deze wachtwoord reset link is ongeldig, verlopen of al
                  gebruikt. Probeer opnieuw een reset aan te vragen.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-4)',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link href="/forgot-password" className="btn btn--primary">
                    Nieuwe reset aanvragen
                  </Link>
                  <Link href="/auth/login" className="btn btn--secondary">
                    Terug naar inloggen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Show success state
  if (success) {
    return (
      <>
        <section className="page-header" data-page="—">
          <div className="container">
            <h1 className="heading-primary">Wachtwoord gewijzigd!</h1>
            <p className="page-header__subtitle">
              Uw wachtwoord is succesvol bijgewerkt
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <div className="card">
              <div className="card__content" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--space-6)',
                    color: 'var(--color-success)',
                  }}
                >
                  ✓
                </div>
                <h2
                  className="heading-secondary"
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  Gelukt!
                </h2>
                <p
                  className="card__description"
                  style={{ marginBottom: 'var(--space-6)' }}
                >
                  Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen met
                  uw nieuwe wachtwoord.
                </p>
                <p
                  className="text-small"
                  style={{
                    color: 'var(--color-text-light)',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  U wordt automatisch doorgestuurd naar de inlogpagina...
                </p>
                <Link href="/auth/login" className="btn btn--primary">
                  Nu inloggen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Nieuw wachtwoord</h1>
          <p className="page-header__subtitle">Voer uw nieuwe wachtwoord in</p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <form onSubmit={handleSubmit} className="form">
            {errors && (
              <div className="form-error form-error--general">
                <p>{errors}</p>
              </div>
            )}

            <div className="form__group">
              <label htmlFor="password" className="form__label">
                Nieuw wachtwoord
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (fieldErrors?.password) {
                    setFieldErrors(prev => ({ ...prev, password: [] }));
                  }
                }}
                className="form__input"
                placeholder="Minimaal 8 tekens"
                disabled={loading}
              />
              {fieldErrors?.password && (
                <div className="form-error">
                  {fieldErrors.password.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="form__group">
              <label htmlFor="confirmPassword" className="form__label">
                Bevestig wachtwoord
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors?.confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: [] }));
                  }
                }}
                className="form__input"
                placeholder="Herhaal uw nieuwe wachtwoord"
                disabled={loading}
              />
              {fieldErrors?.confirmPassword && (
                <div className="form-error">
                  {fieldErrors.confirmPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--large"
              disabled={loading || !password.trim() || !confirmPassword.trim()}
              style={{ width: '100%' }}
            >
              {loading ? 'Wachtwoord wijzigen...' : 'Wachtwoord wijzigen'}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: 'var(--space-8)' }}>
            <p className="card__description">
              Toch niet wijzigen?{' '}
              <Link href="/auth/login" className="text-link">
                Terug naar inloggen
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
