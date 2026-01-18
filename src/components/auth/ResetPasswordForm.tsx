'use client';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resetPasswordFormSchema } from '@/lib/validators/schemas';
import Button from '@/components/magazine/Button';

interface ResetPasswordFormProps {
  token: string | null;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  // errors are a mapping from field name to array of messages (zod.flatten().fieldErrors)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    if (!token) {
      setErrors({ form: ['Geen geldige reset token gevonden.'] });
      setLoading(false);
      return;
    }

    const fd = new FormData(e.currentTarget);

    // Convert FormData to plain object
    const rawFormData = Object.fromEntries(fd.entries()) as Record<
      string,
      unknown
    >;

    // Validate input with Zod
    const validationResult = resetPasswordFormSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setErrors(fieldErrors);
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

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setErrors({
          form: [data.error || 'Er ging iets mis. Probeer het opnieuw.'],
        });
      }
    } catch (err) {
      console.error(err);
      setErrors({ form: ['Er is iets misgegaan. Probeer later opnieuw.'] });
      setLoading(false);
    }
  }

  // Show success state
  if (success) {
    return (
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
            Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen met uw
            nieuwe wachtwoord.
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
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {errors?.form && (
        <div className="form-error form-error--general">
          {errors.form.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
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
          className="form__input"
          placeholder="Minimaal 8 tekens"
          onChange={e => {
            if (errors?.password) {
              setErrors(prev => {
                if (!prev) return null;
                const { password, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
        />
        {errors?.password && (
          <div className="form-error">
            {errors.password.map((msg, i) => (
              <p key={i}>{msg}</p>
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
          className="form__input"
          placeholder="Herhaal uw nieuwe wachtwoord"
          onChange={e => {
            if (errors?.confirmPassword) {
              setErrors(prev => {
                if (!prev) return null;
                const { confirmPassword, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
        />
        {errors?.confirmPassword && (
          <div className="form-error">
            {errors.confirmPassword.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Wachtwoord wijzigen...' : 'Wachtwoord wijzigen'}
      </Button>

      <div className="text-center" style={{ marginTop: 'var(--space-8)' }}>
        <p className="card__description">
          Toch niet wijzigen?{' '}
          <Link href="/auth/login" className="text-link">
            Terug naar inloggen
          </Link>
        </p>
      </div>
    </form>
  );
}
