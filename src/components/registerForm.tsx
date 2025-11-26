'use client';
import type { RegisterResult } from '@/app/api/auth/register/route';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/lib/validators/schemas';
import { set } from 'zod';

type FormProps = {
  createItem: (formData: FormData) => Promise<RegisterResult>;
};
export function RegisterForm({ createItem }: FormProps) {
  // In React+TypeScript kun je een type meegeven aan useState zodat de compiler weet welke shape de state later heeft: useState<Type>(initialValue)

  // errors are a mapping from field name to array of messages (zod.flatten().fieldErrors)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    // Convert FormData to plain object. Values should be strings for our fields.
    const rawFormData = Object.fromEntries(fd.entries()) as Record<
      string,
      unknown
    >;
    // Validate and parse input data with Zod's safeParse method
    const validationResult = registerSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await createItem(fd);
      if (!res.ok) {
        console.log('Registration errors:', res.errors);
        setErrors(res.errors);
        setLoading(false);
        return;
      }
      // success: redirect to login
      router.push('/login');
    } catch (err) {
      console.error(err);
      setErrors({ form: ['Er is iets misgegaan. Probeer later opnieuw.'] });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="">Naam</label>
        <input type="text" name="name" placeholder="John Doe" />
        {errors?.name && (
          <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {errors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="">E-mail</label>
        <input type="email" name="email" placeholder="john.doe@example.com" />
        {errors?.email && (
          <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {errors.email[0]}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="">Paswoord</label>
        <input type="password" name="password" placeholder="test@123!" />
        {errors?.password && (
          <p style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {errors.password[0]}
          </p>
        )}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Bezig...' : 'Verstuur'}
      </button>
    </form>
  );
}
