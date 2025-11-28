'use client';
import React from 'react';
import { loginSchema } from '@/lib/validators/schemas';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  type Errors = string | undefined | null;

  const [errors, setErrors] = useState<Errors>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter(); //om de user na succesvolle login te redirecten

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
        callbackUrl: '/',
      });
      if (!res?.ok) {
        console.log('signIn errors:', res?.error);
        if (res?.error === 'CredentialsSignin') {
          setErrors(
            'Al een account? Controleer je e-mail en paswoord en probeer opnieuw.'
          );
        } else if (res?.error) {
          setErrors('Er is iets misgegaan. Probeer later opnieuw.');
        }
        setLoading(false);
        return;
      }
      router.push('/');
    } catch (err) {
      console.error(err);
      setErrors('Er is iets misgegaan. Probeer later opnieuw.');
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {errors && (
            <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
              {errors}
            </p>
          )}
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            onChange={e => {
              // Clear error when user starts typing
              if (fieldErrors?.email) {
                setFieldErrors(prev => ({ ...prev, email: [] }));
              }
            }}
          />
          {fieldErrors?.email && (
            <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
              {fieldErrors?.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="">Paswoord</label>
          <input
            type="password"
            name="password"
            placeholder="test@123!"
            onChange={e => {
              // Clear error when user starts typing
              if (fieldErrors?.password) {
                setFieldErrors(prev => ({ ...prev, password: [] }));
              }
            }}
          />
          {fieldErrors?.password && (
            <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
              {fieldErrors.password}
            </p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Bezig met inloggen...' : 'Verstuur'}
        </button>
      </form>
    </div>
  );
}
