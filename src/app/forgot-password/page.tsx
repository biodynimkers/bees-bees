'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/lib/validators/schemas';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(null);
    setFieldErrors(null);
    setLoading(true);

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail(''); // Clear form
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

  if (success) {
    return (
      <>
        <section className="page-header" data-page="—">
          <div className="container">
            <h1 className="heading-primary">Reset link verstuurd</h1>
            <p className="page-header__subtitle">
              Controleer uw e-mail voor verdere instructies
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <div className="card">
              <div className="card__content text-center">
                <div className="status-icon status-icon--success">✓</div>
                <h2 className="heading-secondary margin-bottom-small">
                  E-mail verstuurd
                </h2>
                <p className="card__description margin-bottom-large">
                  Als het e-mailadres in ons systeem bestaat, hebben we een
                  reset link verstuurd naar uw inbox. Klik op de link in de
                  e-mail om uw wachtwoord te wijzigen.     De reset link is 1 uur geldig. Controleer ook uw spam folder.
                </p>
            
                <Link href="/auth/login" className="btn btn--secondary">
                  Terug naar inloggen
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
          <h1 className="heading-primary">Wachtwoord vergeten?</h1>
          <p className="page-header__subtitle">
            Voer uw e-mailadres in om een reset link te ontvangen
          </p>
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
              <label htmlFor="email" className="form__label">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (fieldErrors?.email) {
                    setFieldErrors(prev => ({ ...prev, email: [] }));
                  }
                }}
                className="form__input"
                placeholder="uw.naam@voorbeeld.be"
                disabled={loading}
              />
              {fieldErrors?.email && (
                <div className="form-error">
                  {fieldErrors.email.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--large btn--full"
              disabled={loading || !email.trim()}
            >
              {loading ? 'Versturen...' : 'Reset link versturen'}
            </button>
          </form>

          <p className="form__footer-text margin-top-medium">
            Weet u uw wachtwoord weer?{' '}
            <Link href="/auth/login" className="form__link">
              Terug naar inloggen
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
