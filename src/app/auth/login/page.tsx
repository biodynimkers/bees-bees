'use client';
import React from 'react';
import { loginSchema } from '@/lib/validators/schemas';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  type Errors = string | undefined | null;

  const [errors, setErrors] = useState<Errors>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(null);
    setLoading(true);

    const fd = new FormData(event.currentTarget);
    const rawFormData = Object.fromEntries(fd.entries()) as Record<
      string,
      unknown
    >;

    // Validate with Zod
    const validationResult = loginSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const res = await signIn('credentials', {
        ...rawFormData,
        redirect: false,
      });

      if (!res?.ok) {
        if (res?.error === 'CredentialsSignin') {
          setErrors(
            'Onjuiste inloggegevens. Controleer uw e-mail en wachtwoord.',
          );
        } else if (res?.error) {
          setErrors('Er is iets misgegaan. Probeer later opnieuw.');
        }
        setLoading(false);
        return;
      }

      // Check user role and redirect accordingly
      const session = await getSession();

      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err) {
      console.error(err);
      setErrors('Er is iets misgegaan. Probeer later opnieuw.');
      setLoading(false);
    }
  }

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Inloggen</h1>
        </div>
      </section>

      <section className="section ">
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
                className="form__input"
                placeholder="uw.naam@voorbeeld.be"
                onChange={e => {
                  if (fieldErrors?.email) {
                    setFieldErrors(prev => ({ ...prev, email: [] }));
                  }
                }}
              />
              {fieldErrors?.email && (
                <div className="form-error">
                  {fieldErrors.email.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="form__group">
              <label htmlFor="password" className="form__label">
                Wachtwoord
              </label>
              <div className="form__input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form__input form__input--with-icon"
                  placeholder="Uw wachtwoord"
                  onChange={e => {
                    if (fieldErrors?.password) {
                      setFieldErrors(prev => ({ ...prev, password: [] }));
                    }
                  }}
                />
                <button
                  type="button"
                  className="form__toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors?.password && (
                <div className="form-error">
                  {fieldErrors.password.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="form__submit-wrapper">
              <button
                type="submit"
                className="btn btn--primary btn--large btn--full"
                disabled={loading}
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </div>

            <p className="form__footer-text">
              Nog geen account?{' '}
              <Link
                href="/auth/register"
                className="form__link form__link--primary"
              >
                Registreer hier
              </Link>
            </p>
            
            <p className="form__footer-text">
              <Link href="/forgot-password" className="form__link">
                Wachtwoord vergeten?
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
